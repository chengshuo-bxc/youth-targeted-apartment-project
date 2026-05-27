const express = require('express')
const db = require('../config/db')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const router = express.Router()

// 获取用户列表（管理员）
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [list] = await db.query('SELECT user_id, username, name, phone, role_type, gender, age, status, area, create_time FROM users ORDER BY user_id')
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 获取当前用户信息
router.get('/info', authMiddleware, async (req, res) => {
  try {
    const [users] = await db.query('SELECT user_id, username, name, phone, role_type, gender, age, avatar, status, create_time FROM users WHERE user_id = ?', [req.user.user_id])
    res.json({ code: 200, data: users[0] })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 获取管家列表（管理员转交订单用）
router.get('/managers', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [list] = await db.query('SELECT user_id, username, name, phone, area FROM users WHERE role_type = ? AND status = ? ORDER BY user_id', ['manager', 'active'])
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 更新用户状态（管理员）
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.query('UPDATE users SET status = ? WHERE user_id = ?', [req.body.status, req.params.id])
    res.json({ code: 200, message: '更新成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router
