const express = require('express')
const db = require('../config/db')
const router = express.Router()

// 获取公告列表
router.get('/', async (req, res) => {
  try {
    const [list] = await db.query('SELECT * FROM announcements ORDER BY announcement_id DESC')
    res.json({ code: 200, data: list })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router
