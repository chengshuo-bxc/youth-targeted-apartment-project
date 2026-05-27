const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')

async function main() {
  const db = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'youth_apartment'
  })

  try {
    // 1. 检查并添加 area 字段到 users 表
    const [columns] = await db.query("SHOW COLUMNS FROM users LIKE 'area'")
    if (columns.length === 0) {
      await db.query("ALTER TABLE users ADD COLUMN area VARCHAR(50) DEFAULT '' COMMENT '所属区域' AFTER role_type")
      console.log('[OK] users 表已添加 area 字段')
    } else {
      console.log('[SKIP] users 表已有 area 字段')
    }

    // 2. 插入管家账号（如果不存在）
    const [existManager] = await db.query("SELECT user_id FROM users WHERE username = 'guanjia'")
    if (existManager.length === 0) {
      const hash = await bcrypt.hash('123456', 10)
      await db.query(
        `INSERT INTO users (username, password, name, phone, id_card, gender, role_type, area, status) 
         VALUES (?, ?, ?, ?, ?, ?, 'manager', '东区', 'active')`,
        ['guanjia', hash, '李管家', '13800138002', '', '男']
      )
      console.log('[OK] 管家账号已创建: guanjia / 123456')

      // 再插入第二个管家
      await db.query(
        `INSERT INTO users (username, password, name, phone, id_card, gender, role_type, area, status) 
         VALUES (?, ?, ?, ?, ?, ?, 'manager', '西区', 'active')`,
        ['guanjia2', hash, '王管家', '13800138003', '', '女']
      )
      console.log('[OK] 管家2账号已创建: guanjia2 / 123456')
    } else {
      console.log('[SKIP] 管家账号已存在')
    }

    // 3. 将部分房源分配给管家（如果还没分配）
    const [unassignedHouses] = await db.query('SELECT house_id FROM houses WHERE manager_id IS NULL LIMIT 35')
    for (let i = 0; i < unassignedHouses.length; i++) {
      const managerId = i < Math.ceil(unassignedHouses.length / 2) ? 1 : 2
      await db.query('UPDATE houses SET manager_id = ? WHERE house_id = ?', [managerId, unassignedHouses[i].house_id])
    }
    console.log(`[OK] ${unassignedHouses.length} 个房源已分配给管家`)

    console.log('\n========== 完成 ==========')
    console.log('管家账号:')
    console.log('  guanjia / 123456  (东区)')
    console.log('  guanjia2 / 123456  (西区)')
  } catch (err) {
    console.error('错误:', err)
  }

  await db.end()
}

main()
