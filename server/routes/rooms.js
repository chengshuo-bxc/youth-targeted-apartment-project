const express = require('express')
const db = require('../config/db')
const { authMiddleware, adminMiddleware, managerMiddleware } = require('../middleware/auth')
const router = express.Router()

// 前台：获取可租房源列表
router.get('/front', async (req, res) => {
  try {
    const { keyword, type, status, priceMin, priceMax } = req.query
    let sql = 'SELECT * FROM houses WHERE 1=1'
    const params = []
    if (keyword) { sql += ' AND (title LIKE ? OR address LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`) }
    if (type) { sql += ' AND type = ?'; params.push(type) }
    if (status) { sql += ' AND status = ?'; params.push(status) }
    if (priceMin) { sql += ' AND price >= ?'; params.push(Number(priceMin)) }
    if (priceMax) { sql += ' AND price <= ?'; params.push(Number(priceMax)) }
    sql += ' ORDER BY house_id'
    const [list] = await db.query(sql, params)
    const result = list.map(r => ({ ...r, images: JSON.parse(r.images || '[]'), tags: r.tags ? r.tags.split(',') : [], facilities: r.facilities ? r.facilities.split(',') : [] }))
    res.json({ code: 200, data: result })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 获取单个房源
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM houses WHERE house_id = ?', [req.params.id])
    if (rows.length === 0) return res.json({ code: 404, message: '房源不存在' })
    const r = rows[0]
    res.json({ code: 200, data: { ...r, images: JSON.parse(r.images || '[]'), tags: r.tags ? r.tags.split(',') : [], facilities: r.facilities ? r.facilities.split(',') : [] } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 管理端/管家端：获取房源（数据隔离：管理员看全部，管家只看自己的）
router.get('/', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const { keyword, status } = req.query
    let sql = 'SELECT * FROM houses WHERE 1=1'
    const params = []
    
    // 数据隔离：非管理员只能查看自己管理的房源
    if (req.user.role_type !== 'admin') {
      sql += ' AND manager_id = ?'
      params.push(req.user.user_id)
    }
    
    if (keyword) { sql += ' AND (title LIKE ? OR address LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`) }
    if (status) { sql += ' AND status = ?'; params.push(status) }
    sql += ' ORDER BY house_id'
    const [list] = await db.query(sql, params)
    const result = list.map(r => ({ ...r, images: JSON.parse(r.images || '[]'), tags: r.tags ? r.tags.split(',') : [], facilities: r.facilities ? r.facilities.split(',') : [] }))
    res.json({ code: 200, data: result })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 新增房源（管理员可创建任意，管家创建时自动绑定manager_id为自己）
router.post('/', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    const { title, type, area, floor, price, deposit, address, description, tags, facilities } = req.body
    const images = JSON.stringify(req.body.images || [])
    const managerId = req.user.role_type === 'admin' ? (req.body.manager_id || null) : req.user.user_id
    const [result] = await db.query(
      'INSERT INTO houses (title, type, area, floor, price, deposit, address, description, images, tags, facilities, manager_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [title, type, area, floor, price, deposit, address, description, images, (tags || []).join(','), (facilities || []).join(','), managerId]
    )
    res.json({ code: 200, message: '新增成功', data: { house_id: result.insertId } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 更新房源（数据隔离：管家只能修改自己管理的房源）
router.put('/:id', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    // 验证权限：管家只能操作自己管理的房源
    if (req.user.role_type !== 'admin') {
      const [rows] = await db.query('SELECT manager_id FROM houses WHERE house_id = ?', [req.params.id])
      if (rows.length === 0 || rows[0].manager_id != req.user.user_id) {
        return res.status(403).json({ code: 403, message: '无权操作此房源' })
      }
    }
    const { title, type, area, floor, price, deposit, address, description, tags, facilities } = req.body
    const images = JSON.stringify(req.body.images || [])
    await db.query(
      'UPDATE houses SET title=?,type=?,area=?,floor=?,price=?,deposit=?,address=?,description=?,images=?,tags=?,facilities=? WHERE house_id=?',
      [title, type, area, floor, price, deposit, address, description, images, (tags || []).join(','), (facilities || []).join(','), req.params.id]
    )
    res.json({ code: 200, message: '修改成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 变更房源状态（数据隔离）
router.put('/:id/status', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    if (req.user.role_type !== 'admin') {
      const [rows] = await db.query('SELECT manager_id FROM houses WHERE house_id = ?', [req.params.id])
      if (rows.length === 0 || rows[0].manager_id != req.user.user_id) {
        return res.status(403).json({ code: 403, message: '无权操作此房源' })
      }
    }
    await db.query('UPDATE houses SET status = ? WHERE house_id = ?', [req.body.status, req.params.id])
    res.json({ code: 200, message: '状态已更新' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 删除房源（数据隔离）
router.delete('/:id', authMiddleware, managerMiddleware, async (req, res) => {
  try {
    if (req.user.role_type !== 'admin') {
      const [rows] = await db.query('SELECT manager_id FROM houses WHERE house_id = ?', [req.params.id])
      if (rows.length === 0 || rows[0].manager_id != req.user.user_id) {
        return res.status(403).json({ code: 403, message: '无权删除此房源' })
      }
    }
    await db.query('DELETE FROM houses WHERE house_id = ?', [req.params.id])
    res.json({ code: 200, message: '删除成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.code === 'ER_ROW_IS_REFERENCED_' ? '该房源存在关联订单，无法删除' : '服务器错误' })
  }
})

module.exports = router
