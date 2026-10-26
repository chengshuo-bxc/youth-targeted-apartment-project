const path = require('path')
const fs = require('fs')
const mysql = require(path.join(__dirname, '..', 'server', 'node_modules', 'mysql2', 'promise'))

const config = {
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'apartment',
  password: process.env.DB_PASSWORD || 'apartment123',
  database: process.env.DB_NAME || 'youth_apartment',
  charset: 'utf8mb4',
  multipleStatements: true,
  connectTimeout: 5000
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function connectWithRetry(attempts = 90) {
  for (let i = 1; i <= attempts; i++) {
    try {
      return await mysql.createConnection(config)
    } catch (err) {
      if (i === attempts) throw err
      if (i === 1 || i % 10 === 0) console.log(`等待 MySQL 启动... (${i}/${attempts})`)
      await sleep(2000)
    }
  }
}

async function main() {
  const conn = await connectWithRetry()
  try {
    const [tables] = await conn.query("SHOW TABLES LIKE 'users'")
    let count = 0
    if (tables.length > 0) {
      const [rows] = await conn.query('SELECT COUNT(*) AS c FROM users')
      count = rows[0].c
    }
    if (count > 0) {
      console.log(`数据库已有 ${count} 个用户，跳过初始化。`)
      return
    }
    console.log('导入演示数据...')
    const seed = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8')
    await conn.query(seed)
    const [rows] = await conn.query('SELECT COUNT(*) AS c FROM users')
    console.log(`初始化完成，用户数：${rows[0].c}`)
  } finally {
    await conn.end()
  }
}

main().catch((err) => {
  console.error('数据库初始化失败：', err)
  process.exit(1)
})
