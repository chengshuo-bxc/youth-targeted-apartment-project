const mysql = require('mysql2/promise')
require('dotenv').config()

async function fixImages() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  })

  console.log('修复房源图片URL...')

  // 修复错误的 Unsplash URL (c55ez324a6e3 → c55e324a6e3)
  const [result] = await pool.query(
    "UPDATE houses SET images = REPLACE(images, 'c55ez324a6e3', 'c55e324a6e3') WHERE images LIKE '%c55ez324a6e3%'"
  )
  
  console.log(`已修复 ${result.affectedRows} 条房源图片URL`)

  // 验证修复结果
  const [rows] = await pool.query("SELECT house_id, title, images FROM houses WHERE images LIKE '%c55ez324a6e3%'")
  if (rows.length > 0) {
    console.log('警告：仍有错误的URL未修复:')
    rows.forEach(r => console.log(`  ID ${r.house_id}: ${r.title}`))
  } else {
    console.log('所有图片URL已修复完成！')
  }

  await pool.end()
}

fixImages().catch(err => {
  console.error('修复失败:', err.message)
  process.exit(1)
})