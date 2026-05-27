const express = require('express')
const db = require('../config/db')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const router = express.Router()

// 管理端：全部缴费记录
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [list] = await db.query(
      `SELECT p.*, h.title AS room_title, u.name AS user_name
       FROM payments p LEFT JOIN contracts c ON p.contract_id = c.contract_id LEFT JOIN houses h ON c.house_id = h.house_id LEFT JOIN users u ON p.user_id = u.user_id
       ORDER BY p.payment_id`)
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 用户端：我的缴费记录
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const [list] = await db.query(
      `SELECT p.*, h.title AS room_title, u.name AS user_name
       FROM payments p LEFT JOIN contracts c ON p.contract_id = c.contract_id LEFT JOIN houses h ON c.house_id = h.house_id LEFT JOIN users u ON p.user_id = u.user_id
       WHERE p.user_id = ? ORDER BY p.payment_id`, [req.user.user_id])
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 缴费（检查是否所有费用已缴，更新房源状态）
router.put('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const { method } = req.body
    // 更新缴费状态
    await db.query("UPDATE payments SET status = 'paid', pay_time = NOW(), method = ? WHERE payment_id = ?", [method || '支付宝', req.params.id])
    
    // 获取该缴费记录关联的合同和房源
    const [paymentInfo] = await db.query(`
      SELECT p.contract_id, c.house_id 
      FROM payments p 
      LEFT JOIN contracts c ON p.contract_id = c.contract_id 
      WHERE p.payment_id = ?
    `, [req.params.id])
    
    if (paymentInfo.length > 0) {
      const { contract_id, house_id } = paymentInfo[0]
      // 检查该合同下是否还有未缴费用
      const [unpaid] = await db.query(
        "SELECT COUNT(*) as cnt FROM payments WHERE contract_id = ? AND status = 'unpaid'",
        [contract_id]
      )
      // 如果所有费用已缴，更新房源状态为rented
      if (unpaid[0].cnt === 0) {
        await db.query("UPDATE houses SET status = 'rented' WHERE house_id = ?", [house_id])
        res.json({ code: 200, message: '缴费成功，所有费用已缴清，房源已正式租出' })
      } else {
        res.json({ code: 200, message: '缴费成功' })
      }
    } else {
      res.json({ code: 200, message: '缴费成功' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router
