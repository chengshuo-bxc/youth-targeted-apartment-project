const mysql = require('mysql2/promise');
(async()=>{
  const c = await mysql.createPool({host:'localhost',user:'root',password:'root',database:'youth_apartment'});
  // 检查房源的manager_id分配情况
  const [h]=await c.query('SELECT house_id,title,manager_id FROM houses LIMIT 20');
  console.log('=== Houses manager_id ===');
  h.forEach(x=>console.log('  #'+x.house_id+' '+x.title+' => manager='+(x.manager_id||'NULL')));
  
  // 检查管家用户ID
  const [m]=await c.query('SELECT user_id,name,role_type FROM users WHERE role_type=?',['manager']);
  console.log('\n=== Managers ===',JSON.stringify(m));
  
  // 管家能看到哪些订单(模拟张管家 user_id=34)
  const [o]=await c.query(`SELECT o.order_id,o.status,h.title,h.manager_id FROM orders o LEFT JOIN houses h ON o.house_id=h.house_id WHERE h.manager_id=34`);
  console.log('\n=== Orders for 张管家(user_id=34): '+o.length+'条 ===');
  console.log(JSON.stringify(o));

  // 统计所有房源的manager分配
  const [s]=await c.query(`SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN manager_id=34 THEN 1 ELSE 0 END) as to_zhang,
    SUM(CASE WHEN manager_id=35 THEN 1 ELSE 0 END) as to_li,
    SUM(CASE WHEN manager_id=36 THEN 1 ELSE 0 END) as to_wang,
    SUM(CASE WHEN manager_id IS NULL THEN 1 ELSE 0 END) as unassigned
  FROM houses`);
  console.log('\n=== House allocation summary ===');
  console.log(JSON.stringify(s[0]));
  
  await c.end();
})()
