const mysql = require('mysql2/promise')
;(async () => {
  const c = await mysql.createConnection({host:'localhost',user:'root',password:'root',database:'youth_apartment'})
  const [r] = await c.query('SELECT user_id,username,name,role_type,status,area FROM users WHERE role_type=?', ['manager'])
  console.log('Manager records:', JSON.stringify(r, null, 2))
  
  // Also test the exact query from our route
  const [r2] = await c.query("SELECT user_id, username, name, phone, area FROM users WHERE role_type = ? AND status = ?", ['manager', 'active'])
  console.log('\nRoute query result:', JSON.stringify(r2, null, 2))
  await c.end()
})()
