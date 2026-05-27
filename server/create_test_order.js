const mysql = require('mysql2/promise');
(async()=>{
  const c = await mysql.createPool({host:'localhost',user:'root',password:'root',database:'youth_apartment'});
  
  // 创建一条新的pending订单（租客zhangsan user_id=2 预订 A-101 house_id=1，该房源manager_id=34张管家）
  const [ins] = await c.query(
    "INSERT INTO orders (user_id,house_id,type,check_in,check_out,remark,status) VALUES (?,?,?,?,?,?,?)",
    [2, 1, '预订', '2026-05-01', '2027-04-30', '测试订单-待审核', 'pending']
  )
  console.log('Created order #'+ins.insertId+' for zhangsan -> house A-101')
  
  // 确认A-101的manager
  const [h] = await c.query("SELECT manager_id FROM houses WHERE house_id=1")
  console.log('House #1 manager_id: '+h[0].manager_id)
  
  // 验证张管家能看到pending订单
  const sql = `SELECT o.order_id,o.status,o.remark,h.title,u.name AS user_name 
    FROM orders o 
    LEFT JOIN houses h ON o.house_id=h.house_id 
    LEFT JOIN users u ON o.user_id=u.user_id
    WHERE h.manager_id=34 AND o.status='pending'`
  const [orders] = await c.query(sql)
  console.log('\nPending orders visible to 张管家(user_id=34): '+orders.length+'条')
  orders.forEach(o => {
    console.log(`  #${o.order_id} ${o.title} - 租客:${o.user_name} - (${o.status}) ${o.remark}`)
  })
  await c.end()
})()
