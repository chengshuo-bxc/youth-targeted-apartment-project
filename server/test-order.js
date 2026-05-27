const mysql = require('mysql2/promise')
require('dotenv').config()

async function test() {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })
    console.log('数据库连接成功')
    
    const [result] = await pool.query(
      'INSERT INTO orders (user_id, house_id, type, check_in, remark) VALUES (?, ?, ?, ?, ?)',
      [3, 1, '预订', '2026-04-02', '测试预约']
    )
    console.log('订单创建成功, order_id:', result.insertId)
    
    // 删除测试订单
    await pool.query('DELETE FROM orders WHERE order_id = ?', [result.insertId])
    console.log('测试订单已删除')
    
    await pool.end()
  } catch(e) {
    console.error('错误:', e.message)
  }
}

test()