const express = require('express')
const db = require('../config/db')
const { authMiddleware, adminMiddleware, managerMiddleware } = require('../middleware/auth')
const router = express.Router()

// 获取订单列表（带房源和用户名）
async function getOrderList(conditions = [], params = []) {
  let sql = `SELECT o.*, h.title AS room_title, h.images, h.manager_id AS house_manager_id, h.address,
    m.name AS manager_name, m.area AS manager_area, u.name AS user_name
    FROM orders o LEFT JOIN houses h ON o.house_id = h.house_id LEFT JOIN users u ON o.user_id = u.user_id 
    LEFT JOIN users m ON h.manager_id = m.user_id WHERE 1=1`
  for (const c of conditions) { sql += ' ' + c }
  sql += ' ORDER BY o.order_id DESC'
  const [list] = await db.query(sql, params)
  return list.map(r => ({ ...r, images: JSON.parse(r.images || '[]') }))
}

// 管理端/管家端：获取订单（数据隔离：管理员看全部，管家只看自己管理房源的订单）
router.get('/', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const { keyword, status } = req.query
    const conds = [], params = []
    // 数据隔离：非管理员只能查看自己管理房源的订单
    if (req.user.role_type !== 'admin') {
      conds.push('AND h.manager_id = ?')
      params.push(req.user.user_id)
    }
    if (keyword) { conds.push('AND (u.name LIKE ? OR h.title LIKE ?)'); params.push(`%${keyword}%`, `%${keyword}%`) }
    if (status) { conds.push('AND o.status = ?'); params.push(status) }
    const list = await getOrderList(conds, params)
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 用户端：我的订单
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query
    const conds = ['AND o.user_id = ?'], params = [req.user.user_id]
    if (status) { conds.push('AND o.status = ?'); params.push(status) }
    const list = await getOrderList(conds, params)
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 创建订单（同时更新房源状态为reserved）
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('创建订单请求:', req.body)
    console.log('用户信息:', req.user)
    const { house_id, type, check_in, check_out, remark } = req.body
    if (!house_id) {
      return res.json({ code: 400, message: '请选择房源' })
    }
    const [houses] = await db.query('SELECT status FROM houses WHERE house_id = ?', [house_id])
    if (houses.length === 0) return res.json({ code: 404, message: '房源不存在' })
    if (houses[0].status === 'rented') return res.json({ code: 400, message: '该房源已被租用' })

    const [result] = await db.query(
      'INSERT INTO orders (user_id, house_id, type, check_in, check_out, remark, status) VALUES (?,?,?,?,?,?,"pending")',
      [req.user.user_id, house_id, type || '预订', check_in || null, check_out || null, remark || '']
    )
    await db.query("UPDATE houses SET status = 'reserved' WHERE house_id = ?", [house_id])
    res.json({ code: 200, message: '预订成功，请等待审核', data: { order_id: result.insertId } })
  } catch (err) {
    console.error('创建订单错误:', err)
    res.status(500).json({ code: 500, message: '服务器错误: ' + err.message })
  }
})

// 审批通过 - 管家或管理员均可，数据隔离
router.put('/:id/approve', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    if (req.user.role_type !== 'admin') {
      const [orders] = await db.query(`
        SELECT o.order_id FROM orders o LEFT JOIN houses h ON o.house_id = h.house_id 
        WHERE o.order_id = ? AND h.manager_id = ?
      `, [req.params.id, req.user.user_id])
      if (orders.length === 0) return res.status(403).json({ code: 403, message: '无权操作此订单' })
    }

    const [orders] = await db.query(`
      SELECT o.*, h.price, h.deposit as house_deposit, h.title as house_title, u.name as user_name
      FROM orders o LEFT JOIN houses h ON o.house_id = h.house_id LEFT JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `, [req.params.id])
    if (orders.length === 0) return res.json({ code: 404, message: '订单不存在' })

    const order = orders[0]
    await db.query("UPDATE orders SET status = 'active' WHERE order_id = ?", [req.params.id])

    let startDate = order.check_in
    if (startDate) startDate = new Date(startDate).toISOString().slice(0, 10)
    else startDate = new Date().toISOString().slice(0, 10)

    const endDate = new Date(startDate)
    endDate.setFullYear(endDate.getFullYear() + 1)
    const endDateStr = endDate.toISOString().slice(0, 10)

    const contractContent = `甲方：青年公寓运营管理有限公司\n乙方：${order.user_name}\n第一条 租赁房屋\n甲方将位于${order.house_title}出租给乙方。\n第二条 租赁期限\n自${startDate}至${endDateStr}，共计1年。\n第三条 租金\n月租金为人民币${order.price}元，押金${order.house_deposit || order.price}元。`

    const [contractResult] = await db.query(
      `INSERT INTO contracts (order_id, user_id, house_id, start_date, end_date, rent_amount, deposit, status, sign_date, content)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
      [order.order_id, order.user_id, order.house_id, startDate, endDateStr, order.price, order.house_deposit || order.price, startDate, contractContent]
    )

    await db.query(`INSERT INTO payments (contract_id, user_id, amount, type, period, status) VALUES (?, ?, ?, '押金', ?, 'unpaid')`,
      [contractResult.insertId, order.user_id, order.house_deposit || order.price, startDate.slice(0, 7)])
    await db.query(`INSERT INTO payments (contract_id, user_id, amount, type, period, status) VALUES (?, ?, ?, '租金', ?, 'unpaid')`,
      [contractResult.insertId, order.user_id, order.price, startDate.slice(0, 7)])

    res.json({ code: 200, message: '订单已通过，系统已自动生成电子合同和缴费记录' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 驳回订单 - 管家或管理员均可，数据隔离
router.put('/:id/reject', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    if (req.user.role_type !== 'admin') {
      const [orders] = await db.query(`
        SELECT o.order_id FROM orders o LEFT JOIN houses h ON o.house_id = h.house_id 
        WHERE o.order_id = ? AND h.manager_id = ?
      `, [req.params.id, req.user.user_id])
      if (orders.length === 0) return res.status(403).json({ code: 403, message: '无权操作此订单' })
    }

    const [orders] = await db.query('SELECT house_id FROM orders WHERE order_id = ?', [req.params.id])
    if (orders.length > 0) {
      await db.query("UPDATE orders SET status = 'cancelled' WHERE order_id = ?", [req.params.id])
      await db.query("UPDATE houses SET status = 'available' WHERE house_id = ?", [orders[0].house_id])
    }
    res.json({ code: 200, message: '订单已驳回，房源已释放' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 完成/取消订单
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    await db.query('UPDATE orders SET status = ? WHERE order_id = ?', [req.body.status, req.params.id])
    res.json({ code: 200, message: '订单状态已更新' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 管理员：将订单转交给指定管家
router.put('/:id/assign', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { manager_id } = req.body
    if (!manager_id) return res.json({ code: 400, message: '请选择管家' })
    const [managers] = await db.query('SELECT user_id FROM users WHERE user_id = ? AND role_type = ?', [manager_id, 'manager'])
    if (managers.length === 0) return res.json({ code: 400, message: '目标用户不是管家' })
    const [orders] = await db.query('SELECT house_id FROM orders WHERE order_id = ?', [req.params.id])
    if (orders.length === 0) return res.json({ code: 404, message: '订单不存在' })
    await db.query('UPDATE houses SET manager_id = ? WHERE house_id = ?', [manager_id, orders[0].house_id])
    res.json({ code: 200, message: '订单已成功转交给管家，房源负责人已同步更新' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router