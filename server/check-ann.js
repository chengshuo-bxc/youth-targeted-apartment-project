const db = require('./config/db');

(async () => {
  const [rows] = await db.query('SELECT title, content FROM announcements LIMIT 5');
  rows.forEach((r, i) => {
    console.log((i+1) + '. ' + r.title);
    console.log('   内容: ' + r.content);
    console.log('   长度: ' + (r.content || '').length + '字');
    console.log('');
  });
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });