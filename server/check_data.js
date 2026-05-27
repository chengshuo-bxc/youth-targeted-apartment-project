const mysql = require('mysql2/promise')

async function check() {
  const c = await mysql.createConnection({
    host: 'localhost', user: 'root', password: 'root', database: 'youth_apartment'
  })
  const tables = ['users', 'houses', 'orders', 'contracts', 'payments', 'announcements']
  for (const t of tables) {
    const [r] = await c.query('SELECT COUNT(*) as cnt FROM ' + t)
    console.log(t + ': ' + r[0].cnt)
  }

  console.log('\n--- users ---')
  const [users] = await c.query('SELECT user_id, username, role_type, name FROM users')
  console.log(JSON.stringify(users, null, 2))

  console.log('\n--- houses ---')
  const [houses] = await c.query('SELECT house_id, title, status FROM houses')
  console.log(JSON.stringify(houses, null, 2))

  console.log('\n--- orders ---')
  const [orders] = await c.query('SELECT order_id, user_id, house_id, status FROM orders')
  console.log(JSON.stringify(orders, null, 2))

  console.log('\n--- contracts ---')
  const [contracts] = await c.query('SELECT contract_id, user_id, house_id, status FROM contracts')
  console.log(JSON.stringify(contracts, null, 2))
  
  console.log('\n--- payments ---')
  const [payments] = await c.query('SELECT payment_id, contract_id, type, amount, status FROM payments')
  console.log(JSON.stringify(payments, null, 2))

  console.log('\n--- announcements ---')
  const [announcements] = await c.query('SELECT announcement_id, title FROM announcements')
  console.log(JSON.stringify(announcements, null, 2))

  await c.end()
}
check().catch(e => { console.error(e.message); process.exit(1) })
