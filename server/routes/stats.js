const express = require('express')
const db = require('../config/db')
const { authMiddleware, adminMiddleware } = require('../middleware/auth')
const router = express.Router()

// 前台公开统计
router.get('/public', async (req, res) => {
  try {
    const [[{ totalRooms }]] = await db.query('SELECT COUNT(*) AS totalRooms FROM houses')
    const [[{ availableRooms }]] = await db.query("SELECT COUNT(*) AS availableRooms FROM houses WHERE status='available'")
    const [[{ rentedRooms }]] = await db.query("SELECT COUNT(*) AS rentedRooms FROM houses WHERE status='rented'")
    const [[{ totalTenants }]] = await db.query("SELECT COUNT(*) AS totalTenants FROM users WHERE role_type='tenant'")
    res.json({ code: 200, data: { totalRooms, availableRooms, rentedRooms, totalTenants } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 前台详细统计（用于数据分析页面）
router.get('/analysis', async (req, res) => {
  try {
    // 房源状态统计
    const [statusRows] = await db.query(`
      SELECT status, COUNT(*) as count FROM houses GROUP BY status
    `)
    
    // 房源类型统计
    const [typeRows] = await db.query(`
      SELECT type, COUNT(*) as count FROM houses GROUP BY type
    `)
    
    // 房源价格区间统计
    const [priceRows] = await db.query(`
      SELECT 
        CASE 
          WHEN price < 800 THEN '800以下'
          WHEN price BETWEEN 800 AND 1200 THEN '800-1200'
          WHEN price BETWEEN 1200 AND 1800 THEN '1200-1800'
          WHEN price BETWEEN 1800 AND 2500 THEN '1800-2500'
          ELSE '2500以上'
        END as price_range,
        COUNT(*) as count
      FROM houses
      GROUP BY price_range
      ORDER BY 
        CASE price_range
          WHEN '800以下' THEN 1
          WHEN '800-1200' THEN 2
          WHEN '1200-1800' THEN 3
          WHEN '1800-2500' THEN 4
          ELSE 5
        END
    `)
    
    // 房源面积区间统计
    const [areaRows] = await db.query(`
      SELECT 
        CASE 
          WHEN area < 20 THEN '20㎡以下'
          WHEN area BETWEEN 20 AND 30 THEN '20-30㎡'
          WHEN area BETWEEN 30 AND 50 THEN '30-50㎡'
          WHEN area BETWEEN 50 AND 80 THEN '50-80㎡'
          ELSE '80㎡以上'
        END as area_range,
        COUNT(*) as count
      FROM houses
      GROUP BY area_range
      ORDER BY 
        CASE area_range
          WHEN '20㎡以下' THEN 1
          WHEN '20-30㎡' THEN 2
          WHEN '30-50㎡' THEN 3
          WHEN '50-80㎡' THEN 4
          ELSE 5
        END
    `)
    
    // 热门区域统计（按地址前缀）
    const [areaLocationRows] = await db.query(`
      SELECT 
        SUBSTRING_INDEX(address, '区', 1) as district,
        COUNT(*) as count
      FROM houses
      GROUP BY district
      ORDER BY count DESC
      LIMIT 10
    `)
    
    // 配套设施统计（从tags字段解析）
    const [allTags] = await db.query('SELECT tags FROM houses WHERE tags IS NOT NULL AND tags != ""')
    const tagCount = {}
    allTags.forEach(row => {
      // tags 是逗号分隔的字符串，如 "近地铁,独立卫浴,朝南"
      const tags = (row.tags || '').split(',').map(t => t.trim()).filter(t => t)
      tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    })
    const facilityData = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([name, count]) => ({ name, count }))
    
    // 基本统计
    const [[{ totalRooms }]] = await db.query('SELECT COUNT(*) AS totalRooms FROM houses')
    const [[{ availableRooms }]] = await db.query("SELECT COUNT(*) AS availableRooms FROM houses WHERE status='available'")
    const [[{ rentedRooms }]] = await db.query("SELECT COUNT(*) AS rentedRooms FROM houses WHERE status='rented'")
    const [[{ reservedRooms }]] = await db.query("SELECT COUNT(*) AS reservedRooms FROM houses WHERE status='reserved'")
    const [[{ totalTenants }]] = await db.query("SELECT COUNT(*) AS totalTenants FROM users WHERE role_type='tenant'")
    const [[{ avgPrice }]] = await db.query('SELECT AVG(price) AS avgPrice FROM houses')
    const [[{ avgArea }]] = await db.query('SELECT AVG(area) AS avgArea FROM houses')
    
    res.json({ 
      code: 200, 
      data: {
        summary: {
          totalRooms,
          availableRooms,
          rentedRooms,
          reservedRooms,
          totalTenants,
          avgPrice: Math.round(avgPrice) || 0,
          avgArea: Math.round(avgArea * 10) / 10 || 0
        },
        statusStats: statusRows,
        typeStats: typeRows,
        priceStats: priceRows,
        areaStats: areaRows,
        locationStats: areaLocationRows,
        facilityStats: facilityData
      }
    })
  } catch (err) {
    console.error('统计错误:', err)
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

// 仪表盘统计（管理员）
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [[{ totalRooms }]] = await db.query('SELECT COUNT(*) AS totalRooms FROM houses')
    const [[{ availableRooms }]] = await db.query("SELECT COUNT(*) AS availableRooms FROM houses WHERE status='available'")
    const [[{ rentedRooms }]] = await db.query("SELECT COUNT(*) AS rentedRooms FROM houses WHERE status='rented'")
    const [[{ reservedRooms }]] = await db.query("SELECT COUNT(*) AS reservedRooms FROM houses WHERE status='reserved'")
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users")
    const [[{ totalTenants }]] = await db.query("SELECT COUNT(*) AS totalTenants FROM users WHERE role_type='tenant'")
    const [[{ totalOrders }]] = await db.query('SELECT COUNT(*) AS totalOrders FROM orders')
    const [[{ activeOrders }]] = await db.query("SELECT COUNT(*) AS activeOrders FROM orders WHERE status='active'")
    const [[{ totalPayments }]] = await db.query('SELECT COUNT(*) AS totalPayments FROM payments')
    const [[{ paidPayments }]] = await db.query("SELECT COUNT(*) AS paidPayments FROM payments WHERE status='paid'")
    const [[{ unpaidPayments }]] = await db.query("SELECT COUNT(*) AS unpaidPayments FROM payments WHERE status='unpaid'")
    const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(amount),0) AS totalRevenue FROM payments WHERE status='paid'")
    res.json({ code: 200, data: { totalRooms, availableRooms, rentedRooms, reservedRooms, totalUsers, totalTenants, totalOrders, activeOrders, totalPayments, paidPayments, unpaidPayments, totalRevenue } })
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' })
  }
})

module.exports = router