const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
require('dotenv').config()

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  })

  console.log('=== 初始化3个管家账号 ===\n')

  // 1. 清理旧管家（role_type=manager 但不是新创建的）
  await pool.query("UPDATE users SET role_type='tenant', area=NULL WHERE role_type='manager'")
  console.log('已清理旧管家角色\n')

  // 2. 创建/更新3个新管家
  const managers = [
    { username: 'guanjia_a', name: '张管家', phone: '13800001001', area: 'A区（1-3号楼）' },
    { username: 'guanjia_b', name: '李管家', phone: '13800001002', area: 'B区（4-6号楼）' },
    { username: 'guanjia_c', name: '王管家', phone: '13800001003', area: 'C区（7-9号楼）' },
  ]

  const mgrIds = []
  for (const mgr of managers) {
    const hash = await bcrypt.hash('123456', 10)
    const [exist] = await pool.query('SELECT user_id FROM users WHERE username = ?', [mgr.username])
    if (exist.length > 0) {
      await pool.query(
        "UPDATE users SET name=?,phone=?,role_type=?,area=?,password=?,status=? WHERE username=?",
        [mgr.name, mgr.phone, 'manager', mgr.area, hash, 'active', mgr.username]
      )
      console.log(`更新: ${mgr.name} | ${mgr.username} | ${mgr.area}`)
      mgrIds.push(exist[0].user_id)
    } else {
      const [res] = await pool.query(
        "INSERT INTO users (username,password,name,phone,gender,role_type,status,area) VALUES (?,?,?,?,?,?,?,?)",
        [mgr.username, hash, mgr.name, mgr.phone, '男', 'manager', 'active', mgr.area]
      )
      console.log(`创建: ${mgr.name} | ${mgr.username} | ${mgr.area}`)
      mgrIds.push(res.insertId)
    }
  }

  // 3. 清空所有房源的 manager_id，然后重新分配
  await pool.query("UPDATE houses SET manager_id = NULL")
  console.log('\n已清空所有房源负责人\n')

  // 4. 按顺序轮询分配70套房源
  const [houses] = await pool.query('SELECT house_id FROM houses ORDER BY house_id')
  for (let i = 0; i < houses.length; i++) {
    const mid = mgrIds[i % 3]
    await pool.query('UPDATE houses SET manager_id = ? WHERE house_id = ?', [mid, houses[i].house_id])
  }
  console.log(`已将 ${houses.length} 套房源分配给3位管家\n`)

  // 5. 显示最终结果
  const [summary] = await pool.query(`
    SELECT u.user_id, u.name, u.username, u.area, COUNT(h.house_id) AS room_count 
    FROM users u LEFT JOIN houses h ON u.user_id = h.manager_id 
    WHERE u.role_type='manager' GROUP BY u.user_id ORDER BY u.user_id
  `)
  console.log('=== 最终分配结果 ===')
  for (const s of summary) {
    console.log(`  ${s.name} (${s.username}) | ${s.area} | ${s.room_count}套`)
  }
  console.log('\n=== 管家登录密码：123456 ===')
  process.exit(0)
}
main().catch(e => { console.error(e); process.exit(1) })
