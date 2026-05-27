const mysql = require('mysql2/promise');
require('dotenv').config();

async function syncStatus() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // 先将所有房源设为available
  await pool.query("UPDATE houses SET status = 'available'");
  
  // 有active订单的房源设为rented
  await pool.query(`
    UPDATE houses h SET status = 'rented' 
    WHERE EXISTS (SELECT 1 FROM orders o WHERE o.house_id = h.house_id AND o.status = 'active')
  `);
  
  // 有pending订单的房源设为reserved
  await pool.query(`
    UPDATE houses h SET status = 'reserved' 
    WHERE EXISTS (SELECT 1 FROM orders o WHERE o.house_id = h.house_id AND o.status = 'pending')
  `);
  
  console.log('房源状态已同步');
  
  // 验证
  const [houses] = await pool.query('SELECT house_id, status FROM houses');
  const stats = { available: 0, rented: 0, reserved: 0 };
  houses.forEach(h => stats[h.status]++);
  console.log('统计:', stats);
  
  await pool.end();
}

syncStatus();