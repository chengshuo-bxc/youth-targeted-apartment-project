const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

async function init() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env
  const conn = await mysql.createConnection({
    host: DB_HOST, port: parseInt(DB_PORT), user: DB_USER, password: DB_PASSWORD
  })

  console.log('执行建表脚本...')
  const schema = fs.readFileSync(path.join(__dirname, 'sql', 'schema.sql'), 'utf-8')
  const statements = schema.split(';').filter(s => s.trim())
  for (const stmt of statements) {
    if (stmt.trim()) await conn.query(stmt)
  }

  const pool = mysql.createPool({
    host: DB_HOST, port: parseInt(DB_PORT), user: DB_USER, password: DB_PASSWORD, database: DB_NAME
  })

  console.log('插入种子数据...')
  const hash = await bcrypt.hash('123456', 10)

  // 检查是否已有数据
  const [existing] = await pool.query('SELECT COUNT(*) as cnt FROM users')
  if (existing[0].cnt > 0) {
    console.log(`数据库已有数据（${existing[0].cnt} 条用户），跳过种子数据。`)
    await conn.end()
    await pool.end()
    return
  }

  // ===== 优先导入完整数据（如果存在 full_data.sql）=====
  const fullDataPath = path.join(__dirname, 'sql', 'full_data.sql')
  if (fs.existsSync(fullDataPath)) {
    console.log('发现完整数据文件，正在导入...')
    try {
      const fullSql = fs.readFileSync(fullDataPath, 'utf-8')
      // 按分号分割，逐条执行
      const statements = fullSql.split(';').filter(s => s.trim())
      let count = 0
      for (const stmt of statements) {
        if (stmt.trim()) {
          await pool.query(stmt.trim())
          count++
        }
      }
      console.log(`✅ 完整数据导入完成！共 ${count} 条记录`)
      console.log('   包含: 36用户 + 70房源 + 34订单 + 30合同 + 50缴费 + 5公告')
      console.log('管理员账号: admin / 123456')
      await conn.end()
      await pool.end()
      return
    } catch(e) {
      console.warn('完整数据导入失败，回退到基础种子数据:', e.message)
      // 清空可能部分插入的数据
      for (const t of ['payments','contracts','orders','houses','users','announcements']) {
        try { await pool.query(`DELETE FROM ${t}`) } catch(_) {}
      }
    }
  }

  // ===== 基础种子数据（精简版）=====

  // 用户
  const [users] = await pool.query(`INSERT INTO users (username, password, role_type, name, phone, gender, age, status) VALUES
    ('admin', ?, 'admin', '程烁', '13800138001', '男', 22, 'active'),
    ('manager', ?, 'manager', '管家小李', '13800138002', '男', 30, 'active'),
    ('zhangsan', ?, 'tenant', '张三', '13800138003', '男', 24, 'active'),
    ('lisi', ?, 'tenant', '李四', '13800138004', '女', 23, 'active'),
    ('wangwu', ?, 'tenant', '王五', '13800138005', '男', 25, 'active'),
    ('zhaoliu', ?, 'tenant', '赵六', '13800138006', '女', 22, 'inactive'),
    ('sunqi', ?, 'tenant', '孙七', '13800138007', '女', 24, 'active'),
    ('zhouba', ?, 'tenant', '周八', '13800138008', '男', 26, 'active'),
    ('wujiu', ?, 'tenant', '吴九', '13800138009', '女', 23, 'active'),
    ('zhengshi', ?, 'tenant', '郑十', '13800138010', '男', 22, 'active'),
    ('chenyu', ?, 'tenant', '陈雨', '13800138011', '女', 24, 'active'),
    ('liuyang', ?, 'tenant', '刘洋', '13800138012', '男', 25, 'active')`, Array(12).fill(hash))

  // 房源 (取前15条)
  const imgPool = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'
  ]
  const defaultImages = JSON.stringify(imgPool)

  await pool.query(`INSERT INTO houses (title, type, area, floor, price, deposit, address, description, status, images, tags, facilities, create_time) VALUES
    ('阳光精品单间A-101', '单间', 25, '1层', 1200, 1200, '郑州市高新区科学大道100号A栋101', '位于A栋1层，采光充足，配备独立卫浴、空调、热水器。', 'available', ?, '近地铁,独立卫浴,朝南', '空调,热水器,洗衣机,WiFi,独立卫浴', '2026-01-15'),
    ('标准单间A-202', '单间', 22, '2层', 1000, 1000, '郑州市高新区翠竹街88号A栋202', 'A栋2层标准单间，南北通透，性价比高。', 'available', ?, '独立卫浴,WiFi,朝南', '空调,热水器,WiFi,独立卫浴', '2026-03-10'),
    ('雅致单间A-301', '单间', 28, '3层', 1300, 1300, '郑州市高新区莲花街166号A栋301', 'A栋3层雅致单间，暖色调装修风格。', 'available', ?, '朝南,独立卫浴,近商圈', '空调,热水器,洗衣机,WiFi,独立卫浴', '2026-01-25'),
    ('豪华大床房A-401', '单间', 30, '4层', 1500, 1500, '郑州市二七区大学路58号A栋401', 'A栋4层豪华单间，1.8m大床，超大观景阳台。', 'reserved', ?, '大阳台,朝南,高层视野', '空调,热水器,WiFi,独立卫浴,大阳台', '2026-02-10'),
    ('双人间A-501', '双人间', 38, '5层', 1600, 1600, '郑州市金水区文化路92号A栋501', 'A栋5层宽敞双人间，高层采光好。', 'available', ?, '近地铁,高层视野,可短租', '空调,热水器,WiFi,独立卫浴', '2026-02-18'),
    ('精品一室一厅A-601', '一室一厅', 38, '6层', 1900, 1900, '郑州市高新区科学大道100号A栋601', 'A栋6层精品一室一厅，高层朝南。', 'available', ?, '高层,朝南,拎包入住', '空调,热水器,洗衣机,WiFi,冰箱,电视', '2026-03-12'),
    ('温馨一室一厅A-302', '一室一厅', 35, '3层', 1700, 1700, '郑州市高新区翠竹街88号A栋302', 'A栋3层温馨一室一厅，暖色灯光搭配。', 'rented', ?, '拎包入住,近商圈,朝东', '空调,热水器,洗衣机,WiFi,冰箱', '2026-01-20'),
    ('经济单间A-103', '单间', 18, '1层', 750, 750, '郑州市高新区莲花街166号A栋103', 'A栋1层经济单间，面积紧凑但功能齐全。', 'available', ?, '超低价,月付,近公交', '空调,热水器,WiFi,公共卫浴', '2026-02-05'),
    ('温馨一室一厅B-205', '一室一厅', 40, '2层', 1800, 1800, '郑州市高新区科学大道100号B栋205', 'B栋2层精装一室一厅，客厅宽敞明亮。', 'available', ?, '拎包入住,朝南,采光好', '空调,热水器,洗衣机,WiFi,冰箱,电视', '2026-01-20'),
    ('经济单间B-103', '单间', 20, '1层', 800, 800, '郑州市高新区翠竹街88号B栋103', 'B栋1层经济单间，价格实惠。', 'available', ?, '经济实惠,近公交,朝北', '空调,热水器,WiFi,公共卫浴', '2026-03-01'),
    ('舒适两室一厅B-401', '两室一厅', 55, '4层', 2500, 2500, '郑州市高新区莲花街166号B栋401', 'B栋4层舒适两室一厅，两个朝南卧室。', 'available', ?, '整租,朝南,拎包入住', '空调,热水器,洗衣机,WiFi,冰箱,电视', '2026-02-05'),
    ('豪华单间B-501', '单间', 32, '5层', 1600, 1600, '郑州市二七区大学路58号B栋501', 'B栋5层豪华单间，落地窗设计。', 'available', ?, '朝南,大阳台,精装修', '空调,热水器,洗衣机,WiFi,独立卫浴,大阳台', '2026-03-05'),
    ('一室一厅B-302', '一室一厅', 38, '3层', 1750, 1750, '郑州市金水区文化路92号B栋302', 'B栋3层一室一厅，配套齐全。', 'rented', ?, '拎包入住,近商圈,可短租', '空调,热水器,洗衣机,WiFi,冰箱', '2026-02-12'),
    ('双人间B-201', '双人间', 36, '2层', 1450, 1450, '郑州市高新区科学大道100号B栋201', 'B栋2层双人间，两张单人床。', 'available', ?, '独立卫浴,近地铁,可短租', '空调,热水器,WiFi,独立卫浴', '2026-02-25'),
    ('两室一厅B-502', '两室一厅', 62, '5层', 2700, 2700, '郑州市高新区翠竹街88号B栋502', 'B栋5层宽敞两室一厅，客厅可放餐桌。', 'available', ?, '整租,高层视野,朝南', '空调,热水器,洗衣机,WiFi,冰箱,电视', '2026-03-02')`, Array(15).fill(defaultImages))

  // 订单
  await pool.query(`INSERT INTO orders (user_id, house_id, type, status, check_in, check_out, remark, create_time) VALUES
    (3, 1, '预订', 'completed', '2026-02-15', '2027-02-14', '希望安排低楼层', '2026-02-01'),
    (4, 9, '预订', 'active', '2026-03-01', '2027-02-28', '', '2026-02-10'),
    (5, 4, '预订', 'pending', '2026-04-01', '2027-03-31', '需要停车位', '2026-03-10'),
    (3, 13, '预订', 'cancelled', '2025-06-01', '2026-05-31', '工作调动', '2026-01-20'),
    (7, 12, '预订', 'completed', '2026-03-01', '2027-02-28', '', '2026-02-12'),
    (8, 15, '预订', 'active', '2026-03-15', '2027-03-14', '三人合租', '2026-02-25'),
    (9, 11, '预订', 'pending', '2026-04-15', '2027-04-14', '和室友一起住', '2026-03-08'),
    (10, 6, '预订', 'active', '2026-04-01', '2027-03-31', '', '2026-03-12')`)

  // 合同
  await pool.query(`INSERT INTO contracts (order_id, user_id, house_id, start_date, end_date, rent_amount, deposit, status, sign_date, content) VALUES
    (1, 3, 1, '2026-02-15', '2027-02-14', 1200, 1200, 'active', '2026-02-14', '甲方：青年公寓运营管理有限公司\\n乙方：张三\\n第一条 租赁房屋\\n甲方将位于郑州市高新区科学大道100号A栋101号房屋出租给乙方。\\n第二条 租赁期限\\n自2026年2月15日至2027年2月14日，共计1年。\\n第三条 租金\\n月租金为人民币1200元，押金1200元。'),
    (2, 4, 9, '2026-03-01', '2027-02-28', 1800, 1800, 'active', '2026-02-28', '甲方：青年公寓运营管理有限公司\\n乙方：李四\\n第一条 租赁房屋\\n甲方将位于郑州市高新区科学大道100号B栋205号房屋出租给乙方。\\n第二条 租赁期限\\n自2026年3月1日至2027年2月28日，共计1年。\\n第三条 租金\\n月租金为人民币1800元，押金1800元。'),
    (5, 7, 12, '2026-03-01', '2027-02-28', 2100, 2100, 'active', '2026-02-28', '甲方：青年公寓运营管理有限公司\\n乙方：孙七\\n第一条 租赁房屋\\n甲方将位于郑州市金水区文化路92号B栋502号房屋出租给乙方。\\n第二条 租赁期限\\n自2026年3月1日至2027年2月28日。'),
    (6, 8, 15, '2026-03-15', '2027-03-14', 3600, 3600, 'active', '2026-03-14', '甲方：青年公寓运营管理有限公司\\n乙方：周八'),
    (8, 10, 6, '2026-04-01', '2027-03-31', 1900, 1900, 'active', '2026-03-30', '甲方：青年公寓运营管理有限公司\\n乙方：郑十')`)

  // 缴费记录
  await pool.query(`INSERT INTO payments (contract_id, user_id, amount, type, period, status, pay_time, method) VALUES
    (1, 3, 1200, '租金', '2026年2月', 'paid', '2026-02-14 10:30:00', '支付宝'),
    (1, 3, 1200, '押金', '2026年2月', 'paid', '2026-02-14 10:31:00', '支付宝'),
    (1, 3, 1200, '租金', '2026年3月', 'paid', '2026-03-01 09:15:00', '支付宝'),
    (1, 3, 1200, '租金', '2026年4月', 'unpaid', NULL, ''),
    (1, 3, 45, '水费', '2026年3月', 'unpaid', NULL, ''),
    (1, 3, 120, '电费', '2026年3月', 'unpaid', NULL, ''),
    (2, 4, 1800, '租金', '2026年3月', 'paid', '2026-03-01 14:20:00', '微信支付'),
    (2, 4, 1800, '押金', '2026年3月', 'paid', '2026-02-28 16:00:00', '微信支付'),
    (2, 4, 1800, '租金', '2026年4月', 'unpaid', NULL, ''),
    (2, 4, 38, '水费', '2026年3月', 'unpaid', NULL, ''),
    (3, 7, 2100, '租金', '2026年3月', 'paid', '2026-03-01 08:30:00', '支付宝'),
    (3, 7, 2100, '押金', '2026年3月', 'paid', '2026-02-28 09:00:00', '支付宝'),
    (4, 8, 3600, '租金', '2026年3月', 'paid', '2026-03-15 10:00:00', '银行转账'),
    (4, 8, 3600, '押金', '2026年3月', 'paid', '2026-03-14 11:00:00', '银行转账'),
    (5, 10, 1900, '租金', '2026年4月', 'unpaid', NULL, ''),
    (5, 10, 1900, '押金', '2026年4月', 'unpaid', NULL, '')`)

  // 公告
  await pool.query(`INSERT INTO announcements (title, content, create_time) VALUES
    ('关于2026年春节期间物业服务安排的通知', '春节期间（1月28日-2月4日），物业服务热线正常开通，紧急维修可拨打24小时值班电话。', '2026-01-20'),
    ('公寓公共区域WiFi升级公告', '为提升租户上网体验，公寓将于2月15日对公共区域WiFi进行升级，届时可能会有短暂中断。', '2026-02-10'),
    ('3月消防安全演练通知', '根据消防部门要求，公寓将于3月20日下午14:00进行消防安全演练，请各位租户积极参与。', '2026-03-10'),
    ('F栋新楼正式开放入住公告', 'F栋装修全面完工，即日起开放预约看房，首批入住可享首月租金8折优惠。', '2026-03-15'),
    ('关于调整水电费计费方式的通知', '自2026年4月1日起，水电费将采用阶梯计费方式，具体标准详见公告栏。', '2026-03-22')`)

  console.log('数据库初始化完成！')
  console.log('管理员账号: admin / 123456')
  console.log('普通用户: zhangsan / 123456')
  await conn.end()
  await pool.end()
}

init().catch(err => {
  console.error('初始化失败:', err.message)
  process.exit(1)
})
