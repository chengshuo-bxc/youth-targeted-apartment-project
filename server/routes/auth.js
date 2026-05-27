const express = require('express')
const bcrypt = require('bcryptjs')
const db = require('../config/db')
const { generateToken } = require('../config/jwt')
const router = express.Router()

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) return res.json({ code: 400, message: '请输入用户名和密码' })
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username])
    if (users.length === 0) return res.json({ code: 400, message: '用户名或密码错误' })
    const user = users[0]
    if (user.status === 'inactive') return res.json({ code: 400, message: '账号已被禁用' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.json({ code: 400, message: '用户名或密码错误' })
    const token = generateToken({ user_id: user.user_id, role_type: user.role_type })
    res.json({
      code: 200, message: '登录成功', data: {
        token,
        user: { user_id: user.user_id, username: user.username, name: user.name, role_type: user.role_type, phone: user.phone, gender: user.gender, age: user.age, avatar: user.avatar, status: user.status, area: user.area }
      }
    })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, name, phone, id_card, gender } = req.body
    if (!username || !password || !name) return res.json({ code: 400, message: '用户名、密码和姓名不能为空' })
    // 检查用户名是否已存在
    const [existUser] = await db.query('SELECT user_id FROM users WHERE username = ?', [username])
    if (existUser.length > 0) return res.json({ code: 400, message: '用户名已存在' })
    // 检查手机号是否已存在
    if (phone) {
      const [existPhone] = await db.query('SELECT user_id FROM users WHERE phone = ?', [phone])
      if (existPhone.length > 0) return res.json({ code: 400, message: '该手机号已注册' })
    }
    const hash = await bcrypt.hash(password, 10)
    const role_type = 'tenant'
    const status = 'active'
    await db.query(
      'INSERT INTO users (username, password, name, phone, id_card, gender, role_type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [username, hash, name, phone || '', id_card || '', gender || '男', role_type, status]
    )
    res.json({ code: 200, message: '注册成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router
