SELECT 'users' as tbl, COUNT(*) as cnt FROM users
UNION ALL SELECT 'houses', COUNT(*) FROM houses
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'contracts', COUNT(*) FROM contracts
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'announcements', COUNT(*) FROM announcements;
