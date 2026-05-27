const express = require('express')
const db = require('../config/db')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const router = express.Router()

// 管理端：全部合同
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [list] = await db.query(
      `SELECT c.*, h.title AS room_title, u.name AS user_name
       FROM contracts c LEFT JOIN houses h ON c.house_id = h.house_id LEFT JOIN users u ON c.user_id = u.user_id ORDER BY c.contract_id`)
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 用户端：我的合同
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const [list] = await db.query(
      `SELECT c.*, h.title AS room_title, u.name AS user_name
       FROM contracts c LEFT JOIN houses h ON c.house_id = h.house_id LEFT JOIN users u ON c.user_id = u.user_id
       WHERE c.user_id = ? ORDER BY c.contract_id`, [req.user.user_id])
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router
