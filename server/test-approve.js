const mysql = require('mysql2/promise');
require('dotenv').config();

async function testApprove() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    // 先创建一个测试订单
    await pool.query("INSERT INTO orders (user_id, house_id, type, check_in, status) VALUES (3, 5, '预订', '2026-04-15', 'pending')");
    await pool.query("UPDATE houses SET status = 'reserved' WHERE house_id = 5");
    console.log('测试订单创建成功');
    
    // 查找待审批订单
    const [orders] = await pool.query(`
      SELECT o.*, h.price, h.deposit as house_deposit, h.title as house_title, u.name as user_name
      FROM orders o
      LEFT JOIN houses h ON o.house_id = h.house_id
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE o.status = 'pending'
      ORDER BY o.order_id DESC
      LIMIT 1
    `);
    
    if (orders.length === 0) {
      console.log('没有待审批的订单');
      await pool.end();
      return;
    }
    
    const order = orders[0];
    console.log('待审批订单:', order.order_id, order.house_title, order.user_name);
    
    // 测试插入合同
    let startDate = order.check_in;
    if (startDate && startDate.includes('T')) {
      startDate = startDate.slice(0, 10);
    } else if (!startDate) {
      startDate = new Date().toISOString().slice(0, 10);
    }
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);
    const endDateStr = endDate.toISOString().slice(0, 10);
    
    console.log('startDate:', startDate, 'endDateStr:', endDateStr);
    console.log('price:', order.price, 'deposit:', order.house_deposit || order.price);
    
    const [contractResult] = await pool.query(
      `INSERT INTO contracts (order_id, user_id, house_id, start_date, end_date, rent_amount, deposit, status, sign_date, content)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active', ?, ?)`,
      [order.order_id, order.user_id, order.house_id, startDate, endDateStr, order.price, order.house_deposit || order.price, startDate, '合同内容']
    );
    console.log('合同插入成功, contract_id:', contractResult.insertId);
    
    // 插入缴费记录
    await pool.query(
      "INSERT INTO payments (contract_id, user_id, amount, type, period, status) VALUES (?, ?, ?, '押金', ?, 'unpaid')",
      [contractResult.insertId, order.user_id, order.house_deposit || order.price, startDate.slice(0, 7)]
    );
    await pool.query(
      "INSERT INTO payments (contract_id, user_id, amount, type, period, status) VALUES (?, ?, ?, '租金', ?, 'unpaid')",
      [contractResult.insertId, order.user_id, order.price, startDate.slice(0, 7)]
    );
    console.log('缴费记录插入成功');
    
    // 更新订单状态
    await pool.query("UPDATE orders SET status = 'active' WHERE order_id = ?", [order.order_id]);
    console.log('订单状态更新为active');
    
    console.log('审批流程测试成功！');
    await pool.end();
  } catch (err) {
    console.error('错误:', err.message);
    console.error(err);
    await pool.end();
  }
}

testApprove();