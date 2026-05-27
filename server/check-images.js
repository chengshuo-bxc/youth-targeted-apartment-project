const mysql = require('mysql2/promise')
require('dotenv').config()

async function checkImages() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  })

  const [rows] = await pool.query('SELECT house_id, title, images FROM houses')
  console.log('总房源数:', rows.length)
  
  // 检查图片为空或无效的房源
  const problemHouses = rows.filter(r => {
    if (!r.images) return true
    if (r.images === '[]') return true
    if (r.images === 'null') return true
    try {
      const imgs = JSON.parse(r.images)
      return !imgs || imgs.length === 0
    } catch {
      return true
    }
  })
  
  console.log('图片有问题的房源数:', problemHouses.length)
  
  if (problemHouses.length > 0) {
    console.log('\n图片有问题的房源列表:')
    problemHouses.forEach(r => console.log(`  ID: ${r.house_id}, Title: ${r.title}, Images: ${r.images}`))
  }

  await pool.end()
}

checkImages().catch(err => {
  console.error('查询失败:', err.message)
  process.exit(1)
})