const mysql = require('mysql2/promise')
const bcrypt = require('bcryptjs')
require('dotenv').config()

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
  })

  console.log('开始完整导入数据...')

  const imgPool = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1598928506311-c55e324a6e3?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop',
  ]
  function pick3(id) {
    const a = (id * 3) % imgPool.length
    return JSON.stringify([imgPool[a], imgPool[(a + 4) % imgPool.length], imgPool[(a + 7) % imgPool.length]])
  }

  const addrs = [
    '郑州市高新区科学大道100号',
    '郑州市高新区翠竹街88号',
    '郑州市高新区莲花街166号',
    '郑州市二七区大学路58号',
    '郑州市金水区文化路92号',
  ]
  function addr(building, room) {
    return addrs[(building.charCodeAt(0) - 65) % addrs.length] + building + room
  }

  // ===== 房源数据 (70条) =====
  const houses = [
    { id:1, title:'阳光精品单间A-101', type:'单间', area:25, floor:'1层', price:1200, deposit:1200, status:'available', tags:'近地铁,独立卫浴,朝南', description:'位于A栋1层，采光充足，配备独立卫浴、空调、热水器、衣柜、书桌椅等家具家电。距地铁站步行5分钟。', facilities:'空调,热水器,洗衣机,WiFi,独立卫浴,衣柜,书桌椅', address:addr('A','101'), createTime:'2026-01-15' },
    { id:2, title:'标准单间A-202', type:'单间', area:22, floor:'2层', price:1000, deposit:1000, status:'available', tags:'独立卫浴,WiFi,朝南', description:'A栋2层标准单间，南北通透，采光良好。配备独立卫浴和基础家电，性价比高。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('A','202'), createTime:'2026-03-10' },
    { id:3, title:'雅致单间A-301', type:'单间', area:28, floor:'3层', price:1300, deposit:1300, status:'available', tags:'朝南,独立卫浴,近商圈', description:'A栋3层雅致单间，暖色调装修风格，搭配原木家具，独立卫浴干湿分离。', facilities:'空调,热水器,洗衣机,WiFi,独立卫浴,衣柜,书桌椅', address:addr('A','301'), createTime:'2026-01-25' },
    { id:4, title:'豪华大床房A-401', type:'单间', area:30, floor:'4层', price:1500, deposit:1500, status:'reserved', tags:'大阳台,朝南,高层视野', description:'A栋4层豪华单间，1.8m大床，超大观景阳台，装修精致。', facilities:'空调,热水器,洗衣机,WiFi,独立卫浴,衣柜,大阳台', address:addr('A','401'), createTime:'2026-02-10' },
    { id:5, title:'双人间A-501', type:'双人间', area:38, floor:'5层', price:1600, deposit:1600, status:'available', tags:'近地铁,高层视野,可短租', description:'A栋5层宽敞双人间，两张1.5m大床，高层采光好，窗外视野开阔。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜x2,书桌椅x2', address:addr('A','501'), createTime:'2026-02-18' },
    { id:6, title:'精品一室一厅A-601', type:'一室一厅', area:38, floor:'6层', price:1900, deposit:1900, status:'available', tags:'高层,朝南,拎包入住', description:'A栋6层精品一室一厅，高层朝南，采光通风一流，装修简约时尚。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('A','601'), createTime:'2026-03-12' },
    { id:7, title:'温馨一室一厅A-302', type:'一室一厅', area:35, floor:'3层', price:1700, deposit:1700, status:'rented', tags:'拎包入住,近商圈,朝东', description:'A栋3层温馨一室一厅，暖色灯光搭配米白墙面，营造温馨居家感。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,独立卫浴', address:addr('A','302'), createTime:'2026-01-20' },
    { id:8, title:'经济单间A-103', type:'单间', area:18, floor:'1层', price:750, deposit:750, status:'available', tags:'超低价,月付,近公交', description:'A栋1层经济单间，面积紧凑但功能齐全，适合预算有限的年轻人。', facilities:'空调,热水器,WiFi,公共卫浴,衣柜,书桌', address:addr('A','103'), createTime:'2026-02-05' },
    { id:9, title:'舒适双人间A-402', type:'双人间', area:34, floor:'4层', price:1400, deposit:1400, status:'available', tags:'独立卫浴,可短租,近地铁', description:'A栋4层舒适双人间，两张1.2m单人床，适合同学合住。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜x2,书桌椅x2', address:addr('A','402'), createTime:'2026-02-15' },
    { id:10, title:'宽敞一室一厅A-502', type:'一室一厅', area:42, floor:'5层', price:2000, deposit:2000, status:'available', tags:'精装修,大阳台,高层视野', description:'A栋5层宽敞一室一厅，客厅面积大，适合居家办公。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,大阳台', address:addr('A','502'), createTime:'2026-02-20' },
    { id:11, title:'单间A-203', type:'单间', area:24, floor:'2层', price:1100, deposit:1100, status:'available', tags:'近地铁,独立卫浴,朝东', description:'A栋2层标准单间，简约装修，基础家电齐全，通勤便利。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('A','203'), createTime:'2026-03-01' },
    { id:12, title:'两室一厅A-602', type:'两室一厅', area:58, floor:'6层', price:2600, deposit:2600, status:'rented', tags:'整租,高层,采光好', description:'A栋6层两室一厅，高层双卧室朝南，客厅宽敞，适合三人合租。', facilities:'空调x2,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('A','602'), createTime:'2026-02-08' },
    { id:13, title:'温馨一室一厅B-205', type:'一室一厅', area:40, floor:'2层', price:1800, deposit:1800, status:'available', tags:'拎包入住,朝南,采光好', description:'B栋2层精装一室一厅，客厅宽敞明亮，全套家具家电。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机', address:addr('B','205'), createTime:'2026-01-20' },
    { id:14, title:'经济单间B-103', type:'单间', area:20, floor:'1层', price:800, deposit:800, status:'available', tags:'经济实惠,近公交,朝北', description:'B栋1层经济单间，价格实惠，配备基本家具家电。', facilities:'空调,热水器,WiFi,公共卫浴,衣柜,书桌', address:addr('B','103'), createTime:'2026-03-01' },
    { id:15, title:'舒适两室一厅B-401', type:'两室一厅', area:55, floor:'4层', price:2500, deposit:2500, status:'available', tags:'整租,朝南,拎包入住', description:'B栋4层舒适两室一厅，两个朝南卧室，采光优秀。', facilities:'空调x2,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('B','401'), createTime:'2026-02-05' },
    { id:16, title:'迷你单间B-301', type:'单间', area:18, floor:'3层', price:750, deposit:750, status:'available', tags:'超低价,月付,近公交', description:'B栋3层迷你单间，面积紧凑但功能齐全。', facilities:'空调,热水器,WiFi,公共卫浴,衣柜,书桌', address:addr('B','301'), createTime:'2026-02-28' },
    { id:17, title:'豪华单间B-501', type:'单间', area:32, floor:'5层', price:1600, deposit:1600, status:'available', tags:'朝南,大阳台,精装修', description:'B栋5层豪华单间，1.8m大床，落地窗设计，视野开阔。', facilities:'空调,热水器,洗衣机,WiFi,独立卫浴,衣柜,大阳台,书桌椅', address:addr('B','501'), createTime:'2026-03-05' },
    { id:18, title:'一室一厅B-302', type:'一室一厅', area:38, floor:'3层', price:1750, deposit:1750, status:'rented', tags:'拎包入住,近商圈,可短租', description:'B栋3层一室一厅，配套齐全，适合短期租住。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,独立卫浴', address:addr('B','302'), createTime:'2026-02-12' },
    { id:19, title:'双人间B-201', type:'双人间', area:36, floor:'2层', price:1450, deposit:1450, status:'available', tags:'独立卫浴,近地铁,可短租', description:'B栋2层双人间，两张单人床，独立卫浴，适合同学合住。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜x2,书桌椅x2', address:addr('B','201'), createTime:'2026-02-25' },
    { id:20, title:'单间B-102', type:'单间', area:22, floor:'1层', price:900, deposit:900, status:'available', tags:'经济实惠,WiFi,月付', description:'B栋1层单间，价格实惠，适合刚入职的年轻人。', facilities:'空调,热水器,WiFi,公共卫浴,衣柜,书桌椅', address:addr('B','102'), createTime:'2026-03-08' },
    { id:21, title:'两室一厅B-502', type:'两室一厅', area:62, floor:'5层', price:2700, deposit:2700, status:'available', tags:'整租,高层视野,朝南', description:'B栋5层宽敞两室一厅，客厅可放餐桌，适合小家庭。', facilities:'空调x2,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('B','502'), createTime:'2026-03-02' },
    { id:22, title:'女生单间B-402', type:'单间', area:23, floor:'4层', price:1050, deposit:1050, status:'available', tags:'仅限女生,独立卫浴,近商圈', description:'B栋4层女生专属单间，整层女生住户，安全管理严格。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅,梳妆台', address:addr('B','402'), createTime:'2026-03-10' },
    { id:23, title:'一室一厅B-601', type:'一室一厅', area:44, floor:'6层', price:2100, deposit:2100, status:'reserved', tags:'精装修,高层,拎包入住', description:'B栋6层一室一厅，全新装修，品牌家电，居住体验佳。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('B','601'), createTime:'2026-03-15' },
    { id:24, title:'三室一厅B-602', type:'三室一厅', area:88, floor:'6层', price:3800, deposit:3800, status:'available', tags:'整租,高层,采光好', description:'B栋6层大三室一厅，三卧室均朝南，适合家庭居住或多人合租。', facilities:'空调x3,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('B','602'), createTime:'2026-02-18' },
    { id:25, title:'简约双人间C-302', type:'双人间', area:35, floor:'3层', price:1500, deposit:1500, status:'available', tags:'近地铁,独立卫浴,可短租', description:'C栋3层标准双人间，两张1.2m单人床，干湿分离独立卫浴。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('C','302'), createTime:'2026-02-01' },
    { id:26, title:'女生单间C-201', type:'单间', area:23, floor:'2层', price:1100, deposit:1100, status:'available', tags:'仅限女生,近地铁,独立卫浴', description:'C栋2层女生专属单间，粉色系装修，配备梳妆台。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅,梳妆台', address:addr('C','201'), createTime:'2026-02-08' },
    { id:27, title:'精品套房C-403', type:'一室一厅', area:45, floor:'4层', price:2000, deposit:2000, status:'available', tags:'精装修,近地铁,拎包入住', description:'C栋4层精品一室一厅，全新装修，环保材料，品牌家电。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('C','403'), createTime:'2026-03-15' },
    { id:28, title:'合租床位C-501', type:'床位', area:15, floor:'5层', price:550, deposit:550, status:'available', tags:'超低价,女生层,近地铁', description:'C栋5层女生合租床位，六人间配置（实际住4人），环境整洁。', facilities:'空调,热水器,WiFi,公共厨房,公共洗衣房,储物柜,公共阳台', address:addr('C','501'), createTime:'2026-03-18' },
    { id:29, title:'单间C-102', type:'单间', area:21, floor:'1层', price:850, deposit:850, status:'available', tags:'经济实惠,近公交,朝东', description:'C栋1层单间，采光不错，配备基础家电。', facilities:'空调,热水器,WiFi,公共卫浴,衣柜,书桌', address:addr('C','102'), createTime:'2026-03-05' },
    { id:30, title:'一室一厅C-301', type:'一室一厅', area:40, floor:'3层', price:1850, deposit:1850, status:'rented', tags:'朝南,独立卫浴,近商圈', description:'C栋3层一室一厅，装修温馨，适合年轻情侣。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,独立卫浴', address:addr('C','301'), createTime:'2026-02-10' },
    { id:31, title:'双人间C-401', type:'双人间', area:33, floor:'4层', price:1350, deposit:1350, status:'available', tags:'独立卫浴,可短租,朝南', description:'C栋4层双人间，空间宽敞，采光好，适合好友合住。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜x2,书桌椅x2', address:addr('C','401'), createTime:'2026-02-22' },
    { id:32, title:'合租床位C-601', type:'床位', area:15, floor:'6层', price:500, deposit:500, status:'available', tags:'超低价,月付,近公交', description:'C栋6层合租床位，四人间配置，公共设施齐全。', facilities:'空调,热水器,WiFi,公共厨房,公共洗衣房,储物柜', address:addr('C','601'), createTime:'2026-03-12' },
    { id:33, title:'单间C-202', type:'单间', area:26, floor:'2层', price:1150, deposit:1150, status:'available', tags:'朝南,独立卫浴,近地铁', description:'C栋2层标准单间，装修简约，独立卫浴。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('C','202'), createTime:'2026-03-08' },
    { id:34, title:'两室一厅C-502', type:'两室一厅', area:52, floor:'5层', price:2400, deposit:2400, status:'available', tags:'整租,采光好,拎包入住', description:'C栋5层两室一厅，两个卧室大小适中，客厅采光好。', facilities:'空调x2,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('C','502'), createTime:'2026-03-01' },
    { id:35, title:'一室一厅C-103', type:'一室一厅', area:36, floor:'1层', price:1650, deposit:1650, status:'available', tags:'近商圈,拎包入住,朝东', description:'C栋1层一室一厅，出入方便，配套齐全。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('C','103'), createTime:'2026-03-18' },
    { id:36, title:'LOFT单间C-602', type:'LOFT', area:40, floor:'6层', price:2100, deposit:2100, status:'reserved', tags:'LOFT,高层,工业风', description:'C栋6层LOFT单间，上层卧室下层活动区，个性装修。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('C','602'), createTime:'2026-03-20' },
    { id:37, title:'精装两室一厅D-501', type:'两室一厅', area:60, floor:'5层', price:2800, deposit:2800, status:'rented', tags:'整租,采光好,近商圈', description:'D栋5层精装两室一厅，两个卧室均配独立衣柜，客厅餐厅一体。', facilities:'空调x2,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机', address:addr('D','501'), createTime:'2026-02-15' },
    { id:38, title:'合租床位D-602', type:'床位', area:15, floor:'6层', price:600, deposit:600, status:'available', tags:'超低价,近地铁,月付', description:'D栋6层合租床位，四人间配置，公共区域宽敞。', facilities:'空调,热水器,WiFi,公共厨房,公共洗衣房,储物柜', address:addr('D','602'), createTime:'2026-03-20' },
    { id:39, title:'三室一厅D-301', type:'三室一厅', area:85, floor:'3层', price:3600, deposit:3600, status:'available', tags:'整租,采光好,近地铁', description:'D栋3层大三室一厅，三个卧室均有窗户，通风采光好。', facilities:'空调x3,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('D','301'), createTime:'2026-02-22' },
    { id:40, title:'单间D-101', type:'单间', area:24, floor:'1层', price:950, deposit:950, status:'available', tags:'经济实惠,WiFi,近公交', description:'D栋1层单间，出入方便，配备基础家电。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('D','101'), createTime:'2026-02-28' },
    { id:41, title:'双人间D-202', type:'双人间', area:36, floor:'2层', price:1550, deposit:1550, status:'available', tags:'独立卫浴,近商圈,可短租', description:'D栋2层双人间，空间充裕，采光良好。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜x2,书桌椅x2', address:addr('D','202'), createTime:'2026-03-02' },
    { id:42, title:'一室一厅D-302', type:'一室一厅', area:42, floor:'3层', price:1950, deposit:1950, status:'available', tags:'朝南,拎包入住,近地铁', description:'D栋3层一室一厅，客厅宽敞，装修现代。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('D','302'), createTime:'2026-03-06' },
    { id:43, title:'两室一厅D-401', type:'两室一厅', area:56, floor:'4层', price:2650, deposit:2650, status:'available', tags:'整租,朝南,采光好', description:'D栋4层两室一厅，适合好友或小家庭居住。', facilities:'空调x2,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('D','401'), createTime:'2026-03-10' },
    { id:44, title:'单间D-502', type:'单间', area:27, floor:'5层', price:1250, deposit:1250, status:'available', tags:'朝南,独立卫浴,高层视野', description:'D栋5层单间，高层采光好，视野开阔。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('D','502'), createTime:'2026-03-15' },
    { id:45, title:'合租床位D-102', type:'床位', area:15, floor:'1层', price:580, deposit:580, status:'available', tags:'超低价,月付,近公交', description:'D栋1层合租床位，四人间，公共厨房和洗衣房。', facilities:'空调,热水器,WiFi,公共厨房,公共洗衣房,储物柜', address:addr('D','102'), createTime:'2026-03-18' },
    { id:46, title:'LOFT一室一厅D-601', type:'LOFT', area:48, floor:'6层', price:2300, deposit:2300, status:'available', tags:'LOFT,高层视野,工业风', description:'D栋6层LOFT户型，上层卧室下层客厅，工业风个性装修。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,独立卫浴,开放式厨房', address:addr('D','601'), createTime:'2026-02-20' },
    { id:47, title:'单间D-201', type:'单间', area:23, floor:'2层', price:1050, deposit:1050, status:'rented', tags:'独立卫浴,近地铁,朝东', description:'D栋2层单间，装修干净整洁，通勤方便。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('D','201'), createTime:'2026-02-15' },
    { id:48, title:'三室一厅D-503', type:'三室一厅', area:90, floor:'5层', price:3900, deposit:3900, status:'available', tags:'整租,采光好,大客厅', description:'D栋5层大三室一厅，客厅面积大，适合家庭或多人合租。', facilities:'空调x3,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('D','503'), createTime:'2026-03-08' },
    { id:49, title:'LOFT复式公寓E-201', type:'LOFT', area:45, floor:'2层', price:2200, deposit:2200, status:'available', tags:'LOFT,层高3.6m,工业风', description:'E栋LOFT复式户型，层高3.6米，上层卧室下层客厅，工业风装修。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,独立卫浴', address:addr('E','201'), createTime:'2026-03-05' },
    { id:50, title:'轻奢一室一厅E-301', type:'一室一厅', area:42, floor:'3层', price:2100, deposit:2100, status:'rented', tags:'精装修,大阳台,近商圈', description:'E栋3层轻奢一室一厅，智能门锁、智能灯光，超大阳台。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,智能门锁,大阳台', address:addr('E','301'), createTime:'2026-02-12' },
    { id:51, title:'LOFT双人居E-401', type:'LOFT', area:50, floor:'4层', price:2500, deposit:2500, status:'reserved', tags:'LOFT,可住两人,工业风', description:'E栋4层LOFT双人居，上下层卧室区域，开放式厨房，拍照打卡圣地。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,油烟机,独立卫浴,开放式厨房', address:addr('E','401'), createTime:'2026-03-08' },
    { id:52, title:'单间E-101', type:'单间', area:24, floor:'1层', price:1000, deposit:1000, status:'available', tags:'近地铁,独立卫浴,朝南', description:'E栋1层单间，简约装修，配套齐全，交通便利。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('E','101'), createTime:'2026-02-20' },
    { id:53, title:'一室一厅E-202', type:'一室一厅', area:39, floor:'2层', price:1900, deposit:1900, status:'available', tags:'朝南,拎包入住,近商圈', description:'E栋2层一室一厅，装修现代简约，全套家具。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('E','202'), createTime:'2026-03-01' },
    { id:54, title:'两室一厅E-302', type:'两室一厅', area:58, floor:'3层', price:2700, deposit:2700, status:'available', tags:'整租,精装修,采光好', description:'E栋3层两室一厅，品牌装修，两个卧室朝南。', facilities:'空调x2,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('E','302'), createTime:'2026-03-05' },
    { id:55, title:'双人间E-301', type:'双人间', area:37, floor:'3层', price:1500, deposit:1500, status:'available', tags:'独立卫浴,近地铁,可短租', description:'E栋3层双人间，空间宽敞，适合同学或好友同住。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜x2,书桌椅x2', address:addr('E','301'), createTime:'2026-03-10' },
    { id:56, title:'单间E-402', type:'单间', area:22, floor:'4层', price:980, deposit:980, status:'available', tags:'经济实惠,WiFi,独立卫浴', description:'E栋4层经济单间，价格实惠，独立卫浴。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('E','402'), createTime:'2026-03-12' },
    { id:57, title:'LOFT三室E-501', type:'三室一厅', area:95, floor:'5层', price:4000, deposit:4000, status:'available', tags:'LOFT,整租,大空间', description:'E栋5层LOFT三室，超大空间，适合多人合租或小家庭。', facilities:'空调x3,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2,开放式厨房', address:addr('E','501'), createTime:'2026-03-15' },
    { id:58, title:'女生单间E-201', type:'单间', area:24, floor:'2层', price:1080, deposit:1080, status:'available', tags:'仅限女生,独立卫浴,近地铁', description:'E栋2层女生单间，粉色系装修，安全性高。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅,梳妆台', address:addr('E','201'), createTime:'2026-03-18' },
    { id:59, title:'一室一厅E-502', type:'一室一厅', area:41, floor:'5层', price:2050, deposit:2050, status:'available', tags:'高层,朝南,精装修', description:'E栋5层一室一厅，高层视野好，装修精美。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('E','502'), createTime:'2026-03-20' },
    { id:60, title:'合租床位E-601', type:'床位', area:15, floor:'6层', price:520, deposit:520, status:'available', tags:'超低价,月付,近公交', description:'E栋6层合租床位，四人间配置，公共设施齐全。', facilities:'空调,热水器,WiFi,公共厨房,公共洗衣房,储物柜', address:addr('E','601'), createTime:'2026-03-22' },
    { id:61, title:'阳光单间F-101', type:'单间', area:26, floor:'1层', price:1150, deposit:1150, status:'available', tags:'朝南,独立卫浴,近地铁', description:'F栋1层阳光单间，采光充足，装修温馨。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜,书桌椅', address:addr('F','101'), createTime:'2026-03-01' },
    { id:62, title:'一室一厅F-201', type:'一室一厅', area:40, floor:'2层', price:1850, deposit:1850, status:'available', tags:'拎包入住,近商圈,朝南', description:'F栋2层一室一厅，全套品牌家电，入住即享。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('F','201'), createTime:'2026-03-05' },
    { id:63, title:'双人间F-301', type:'双人间', area:35, floor:'3层', price:1450, deposit:1450, status:'available', tags:'独立卫浴,可短租,近地铁', description:'F栋3层双人间，空间适中，适合合住。', facilities:'空调,热水器,WiFi,独立卫浴,衣柜x2,书桌椅x2', address:addr('F','301'), createTime:'2026-03-08' },
    { id:64, title:'两室一厅F-401', type:'两室一厅', area:55, floor:'4层', price:2550, deposit:2550, status:'available', tags:'整租,朝南,采光好', description:'F栋4层两室一厅，装修干净整洁，适合合租。', facilities:'空调x2,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('F','401'), createTime:'2026-03-10' },
    { id:65, title:'LOFT一室F-501', type:'LOFT', area:43, floor:'5层', price:2250, deposit:2250, status:'rented', tags:'LOFT,高层视野,工业风', description:'F栋5层LOFT户型，个性装修，高层采光好。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,独立卫浴', address:addr('F','501'), createTime:'2026-02-25' },
    { id:66, title:'单间F-202', type:'单间', area:20, floor:'2层', price:880, deposit:880, status:'available', tags:'经济实惠,月付,近公交', description:'F栋2层经济单间，价格实惠，适合短期过渡。', facilities:'空调,热水器,WiFi,公共卫浴,衣柜,书桌', address:addr('F','202'), createTime:'2026-03-12' },
    { id:67, title:'一室一厅F-302', type:'一室一厅', area:38, floor:'3层', price:1800, deposit:1800, status:'available', tags:'朝南,拎包入住,近商圈', description:'F栋3层一室一厅，配套齐全，居住方便。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴', address:addr('F','302'), createTime:'2026-03-15' },
    { id:68, title:'合租床位F-601', type:'床位', area:15, floor:'6层', price:560, deposit:560, status:'available', tags:'超低价,近地铁,月付', description:'F栋6层合租床位，四人间，配备公共厨房和洗衣房。', facilities:'空调,热水器,WiFi,公共厨房,公共洗衣房,储物柜', address:addr('F','601'), createTime:'2026-03-18' },
    { id:69, title:'三室一厅F-402', type:'三室一厅', area:82, floor:'4层', price:3500, deposit:3500, status:'available', tags:'整租,采光好,拎包入住', description:'F栋4层三室一厅，三个卧室布局合理，客厅宽敞。', facilities:'空调x3,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,独立卫浴x2', address:addr('F','402'), createTime:'2026-03-20' },
    { id:70, title:'豪华一室一厅F-502', type:'一室一厅', area:46, floor:'5层', price:2300, deposit:2300, status:'reserved', tags:'精装修,大阳台,高层视野', description:'F栋5层豪华一室一厅，全景落地窗，品牌装修，享受品质生活。', facilities:'空调,热水器,洗衣机,WiFi,冰箱,电视,燃气灶,油烟机,智能门锁,大阳台,独立卫浴', address:addr('F','502'), createTime:'2026-03-22' },
  ]

  // 插入房源（使用固定ID）
  console.log(`插入房源: ${houses.length} 条...`)
  for (const h of houses) {
    await pool.query(
      `INSERT INTO houses (house_id, title, type, area, floor, price, deposit, address, description, status, images, tags, facilities, create_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [h.id, h.title, h.type, h.area, h.floor, h.price, h.deposit, h.address, h.description, h.status, pick3(h.id), h.tags, h.facilities, h.createTime]
    )
  }

  // ===== 用户 (27人) =====
  const hash = await bcrypt.hash('123456', 10)
  const users = [
    ['admin','admin','程烁','13800138001','男',22,'active','2026-01-01'],
    ['manager','manager','管家小李','13800138002','男',30,'active','2026-01-05'],
    ['zhangsan','tenant','张三','13800138003','男',24,'active','2026-01-15'],
    ['lisi','tenant','李四','13800138004','女',23,'active','2026-02-01'],
    ['wangwu','tenant','王五','13800138005','男',25,'active','2026-02-10'],
    ['zhaoliu','tenant','赵六','13800138006','女',22,'inactive','2026-02-20'],
    ['sunqi','tenant','孙七','13800138007','女',24,'active','2026-03-01'],
    ['zhouba','tenant','周八','13800138008','男',26,'active','2026-03-05'],
    ['wujiu','tenant','吴九','13800138009','女',23,'active','2026-03-10'],
    ['zhengshi','tenant','郑十','13800138010','男',22,'active','2026-03-15'],
    ['chenyu','tenant','陈雨','13800138011','女',24,'active','2026-01-20'],
    ['liuyang','tenant','刘洋','13800138012','男',25,'active','2026-01-25'],
    ['yangfang','tenant','杨芳','13800138013','女',23,'active','2026-02-05'],
    ['huanglei','tenant','黄磊','13800138014','男',27,'active','2026-02-08'],
    ['hejing','tenant','何静','13800138015','女',22,'active','2026-02-15'],
    ['machao','tenant','马超','13800138016','男',26,'active','2026-02-18'],
    ['linxue','tenant','林雪','13800138017','女',24,'active','2026-02-25'],
    ['xuming','tenant','徐明','13800138018','男',28,'active','2026-03-01'],
    ['gaoyue','tenant','高悦','13800138019','女',23,'active','2026-03-05'],
    ['luohui','tenant','罗辉','13800138020','男',25,'active','2026-03-08'],
    ['liangting','tenant','梁婷','13800138021','女',22,'active','2026-03-10'],
    ['xiejun','tenant','谢军','13800138022','男',24,'inactive','2026-03-12'],
    ['hanxue','tenant','韩雪','13800138023','女',25,'active','2026-03-15'],
    ['tanghao','tenant','唐浩','13800138024','男',23,'active','2026-03-18'],
    ['fengping','tenant','冯萍','13800138025','女',26,'active','2026-03-20'],
    ['dongqiang','tenant','董强','13800138026','男',27,'active','2026-03-22'],
    ['chengying','tenant','程颖','13800138027','女',21,'active','2026-03-25'],
  ]

  console.log(`插入用户: ${users.length} 条...`)
  for (let i = 0; i < users.length; i++) {
    const u = users[i]
    await pool.query(
      `INSERT INTO users (user_id, username, password, role_type, name, phone, gender, age, status, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [i + 1, u[0], hash, u[1], u[2], u[3], u[4], u[5], u[6], u[7]]
    )
  }

  // ===== 订单 (17条) =====
  const orders = [
    [3, 1, '预订', 'completed', '2026-02-15', '2027-02-14', '希望安排低楼层', '2026-02-01'],
    [4, 13, '预订', 'active', '2026-03-01', '2027-02-28', '', '2026-02-10'],
    [5, 4, '预订', 'pending', '2026-04-01', '2027-03-31', '需要停车位', '2026-03-10'],
    [3, 37, '退租', 'cancelled', '2025-06-01', '2026-05-31', '工作调动', '2026-01-20'],
    [7, 50, '预订', 'completed', '2026-03-01', '2027-02-28', '', '2026-02-12'],
    [8, 39, '预订', 'active', '2026-03-15', '2027-03-14', '三人合租', '2026-02-25'],
    [9, 51, '预订', 'pending', '2026-04-15', '2027-04-14', '和室友一起住', '2026-03-08'],
    [10, 6, '预订', 'active', '2026-04-01', '2027-03-31', '', '2026-03-12'],
    [11, 7, '预订', 'completed', '2026-02-01', '2027-01-31', '', '2026-01-18'],
    [12, 12, '预订', 'completed', '2026-02-20', '2027-02-19', '朋友合租', '2026-02-05'],
    [14, 30, '预订', 'completed', '2026-03-01', '2027-02-28', '', '2026-02-08'],
    [16, 18, '预订', 'completed', '2026-03-01', '2027-02-28', '可短租', '2026-02-10'],
    [18, 65, '预订', 'completed', '2026-03-10', '2027-03-09', '', '2026-02-22'],
    [20, 47, '预订', 'completed', '2026-03-01', '2027-02-28', '', '2026-02-12'],
    [15, 36, '预订', 'pending', '2026-04-20', '2027-04-19', '喜欢LOFT风格', '2026-03-20'],
    [24, 23, '预订', 'pending', '2026-05-01', '2027-04-30', '', '2026-03-15'],
    [26, 70, '预订', 'active', '2026-04-15', '2027-04-14', '需要高层', '2026-03-22'],
  ]

  console.log(`插入订单: ${orders.length} 条...`)
  for (const o of orders) {
    await pool.query(
      `INSERT INTO orders (order_id, user_id, house_id, type, status, check_in, check_out, remark, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orders.indexOf(o) + 1, ...o]
    )
  }

  // ===== 合同 (11条) =====
  const contracts = [
    [1, 3, 1, '2026-02-15', '2027-02-14', 1200, 1200, 'active', '2026-02-14', '甲方：青年公寓运营管理有限公司\n乙方：张三\n第一条 租赁房屋\n甲方将位于郑州市高新区科学大道100号A栋101号房屋出租给乙方。\n第二条 租赁期限\n自2026年2月15日至2027年2月14日，共计1年。\n第三条 租金\n月租金为人民币1200元，押金1200元。'],
    [2, 4, 13, '2026-03-01', '2027-02-28', 1800, 1800, 'active', '2026-02-28', '甲方：青年公寓运营管理有限公司\n乙方：李四\n第一条 租赁房屋\n甲方将位于郑州市高新区翠竹街88号B栋205号房屋出租给乙方。\n第二条 租赁期限\n自2026年3月1日至2027年2月28日，共计1年。\n第三条 租金\n月租金为人民币1800元，押金1800元。'],
    [5, 7, 50, '2026-03-01', '2027-02-28', 2100, 2100, 'active', '2026-02-28', '甲方：青年公寓运营管理有限公司\n乙方：孙七\n第一条 租赁房屋\n甲方将位于郑州市金水区文化路92号E栋301号房屋出租给乙方。\n第二条 租赁期限\n自2026年3月1日至2027年2月28日，共计1年。\n第三条 租金\n月租金为人民币2100元，押金2100元。'],
    [6, 8, 39, '2026-03-15', '2027-03-14', 3600, 3600, 'active', '2026-03-14', '甲方：青年公寓运营管理有限公司\n乙方：周八\n第一条 租赁房屋\n甲方将位于郑州市高新区莲花街166号D栋301号房屋出租给乙方。\n第二条 租赁期限\n自2026年3月15日至2027年3月14日，共计1年。\n第三条 租金\n月租金为人民币3600元，押金3600元。'],
    [8, 10, 6, '2026-04-01', '2027-03-31', 1900, 1900, 'active', '2026-03-30', '甲方：青年公寓运营管理有限公司\n乙方：郑十\n第一条 租赁房屋\n甲方将位于郑州市高新区科学大道100号A栋601号房屋出租给乙方。\n第二条 租赁期限\n自2026年4月1日至2027年3月31日，共计1年。\n第三条 租金\n月租金为人民币1900元，押金1900元。'],
    [9, 11, 7, '2026-02-01', '2027-01-31', 1700, 1700, 'active', '2026-01-31', '甲方：青年公寓运营管理有限公司\n乙方：陈雨\n第一条 租赁房屋\n甲方将位于郑州市高新区科学大道100号A栋302号房屋出租给乙方。\n第二条 租赁期限\n自2026年2月1日至2027年1月31日，共计1年。\n第三条 租金\n月租金为人民币1700元，押金1700元。'],
    [10, 12, 12, '2026-02-20', '2027-02-19', 2600, 2600, 'active', '2026-02-19', '甲方：青年公寓运营管理有限公司\n乙方：刘洋\n第一条 租赁房屋\n甲方将位于郑州市高新区科学大道100号A栋602号房屋出租给乙方。\n第二条 租赁期限\n自2026年2月20日至2027年2月19日，共计1年。\n第三条 租金\n月租金为人民币2600元，押金2600元。'],
    [11, 14, 30, '2026-03-01', '2027-02-28', 1850, 1850, 'active', '2026-02-28', '甲方：青年公寓运营管理有限公司\n乙方：黄磊\n第一条 租赁房屋\n甲方将位于郑州市二七区大学路58号C栋301号房屋出租给乙方。\n第二条 租赁期限\n自2026年3月1日至2027年2月28日，共计1年。\n第三条 租金\n月租金为人民币1850元，押金1850元。'],
    [12, 16, 18, '2026-03-01', '2027-02-28', 1750, 1750, 'active', '2026-02-28', '甲方：青年公寓运营管理有限公司\n乙方：马超\n第一条 租赁房屋\n甲方将位于郑州市高新区翠竹街88号B栋302号房屋出租给乙方。\n第二条 租赁期限\n自2026年3月1日至2027年2月28日，共计1年。\n第三条 租金\n月租金为人民币1750元，押金1750元。'],
    [13, 18, 65, '2026-03-10', '2027-03-09', 2250, 2250, 'active', '2026-03-09', '甲方：青年公寓运营管理有限公司\n乙方：徐明\n第一条 租赁房屋\n甲方将位于郑州市高新区莲花街166号F栋501号房屋出租给乙方。\n第二条 租赁期限\n自2026年3月10日至2027年3月9日，共计1年。\n第三条 租金\n月租金为人民币2250元，押金2250元。'],
    [14, 20, 47, '2026-03-01', '2027-02-28', 1050, 1050, 'active', '2026-02-28', '甲方：青年公寓运营管理有限公司\n乙方：罗辉\n第一条 租赁房屋\n甲方将位于郑州市高新区莲花街166号D栋201号房屋出租给乙方。\n第二条 租赁期限\n自2026年3月1日至2027年2月28日，共计1年。\n第三条 租金\n月租金为人民币1050元，押金1050元。'],
  ]

  console.log(`插入合同: ${contracts.length} 条...`)
  for (let i = 0; i < contracts.length; i++) {
    const c = contracts[i]
    await pool.query(
      `INSERT INTO contracts (contract_id, order_id, user_id, house_id, start_date, end_date, rent_amount, deposit, status, sign_date, content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [i + 1, ...c]
    )
  }

  // ===== 缴费记录 (34条) =====
  const payments = [
    [1, 3, 1200, '租金', '2026年2月', 'paid', '2026-02-14 10:30:00', '支付宝'],
    [1, 3, 1200, '押金', '2026年2月', 'paid', '2026-02-14 10:31:00', '支付宝'],
    [1, 3, 1200, '租金', '2026年3月', 'paid', '2026-03-01 09:15:00', '支付宝'],
    [1, 3, 1200, '租金', '2026年4月', 'unpaid', null, ''],
    [1, 3, 45, '水费', '2026年3月', 'unpaid', null, ''],
    [1, 3, 120, '电费', '2026年3月', 'unpaid', null, ''],
    [2, 4, 1800, '租金', '2026年3月', 'paid', '2026-03-01 14:20:00', '微信支付'],
    [2, 4, 1800, '押金', '2026年3月', 'paid', '2026-02-28 16:00:00', '微信支付'],
    [2, 4, 1800, '租金', '2026年4月', 'unpaid', null, ''],
    [2, 4, 38, '水费', '2026年3月', 'unpaid', null, ''],
    [3, 7, 2100, '租金', '2026年3月', 'paid', '2026-03-01 08:30:00', '支付宝'],
    [3, 7, 2100, '押金', '2026年3月', 'paid', '2026-02-28 09:00:00', '支付宝'],
    [3, 7, 2100, '租金', '2026年4月', 'unpaid', null, ''],
    [4, 8, 3600, '租金', '2026年3月', 'paid', '2026-03-15 10:00:00', '银行转账'],
    [4, 8, 3600, '押金', '2026年3月', 'paid', '2026-03-14 11:00:00', '银行转账'],
    [5, 10, 1900, '租金', '2026年4月', 'unpaid', null, ''],
    [5, 10, 1900, '押金', '2026年4月', 'unpaid', null, ''],
    [6, 11, 1700, '租金', '2026年2月', 'paid', '2026-02-01 09:00:00', '微信支付'],
    [6, 11, 1700, '押金', '2026年2月', 'paid', '2026-01-31 15:00:00', '微信支付'],
    [6, 11, 1700, '租金', '2026年3月', 'paid', '2026-03-01 08:45:00', '微信支付'],
    [6, 11, 1700, '租金', '2026年4月', 'unpaid', null, ''],
    [7, 12, 2600, '租金', '2026年3月', 'paid', '2026-03-01 10:00:00', '支付宝'],
    [7, 12, 2600, '押金', '2026年2月', 'paid', '2026-02-19 16:30:00', '支付宝'],
    [7, 12, 55, '水费', '2026年3月', 'paid', '2026-03-25 14:00:00', '支付宝'],
    [8, 14, 1850, '租金', '2026年3月', 'paid', '2026-03-01 11:20:00', '微信支付'],
    [8, 14, 1850, '押金', '2026年3月', 'paid', '2026-02-28 13:00:00', '微信支付'],
    [9, 16, 1750, '租金', '2026年3月', 'paid', '2026-03-01 09:30:00', '支付宝'],
    [9, 16, 1750, '押金', '2026年3月', 'paid', '2026-02-28 10:00:00', '支付宝'],
    [10, 18, 2250, '租金', '2026年3月', 'paid', '2026-03-10 08:00:00', '银行转账'],
    [10, 18, 2250, '押金', '2026年3月', 'paid', '2026-03-09 09:30:00', '银行转账'],
    [10, 18, 165, '电费', '2026年3月', 'unpaid', null, ''],
    [11, 20, 1050, '租金', '2026年3月', 'paid', '2026-03-01 12:00:00', '微信支付'],
    [11, 20, 1050, '押金', '2026年3月', 'paid', '2026-02-28 14:30:00', '微信支付'],
    [11, 20, 22, '水费', '2026年3月', 'paid', '2026-03-20 10:00:00', '微信支付'],
  ]

  console.log(`插入缴费记录: ${payments.length} 条...`)
  for (let i = 0; i < payments.length; i++) {
    const p = payments[i]
    await pool.query(
      `INSERT INTO payments (payment_id, contract_id, user_id, amount, type, period, status, pay_time, method) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [i + 1, ...p]
    )
  }

  // ===== 公告 (5条) =====
  await pool.query(`INSERT INTO announcements (title, content, create_time) VALUES
    ('关于2026年春节期间物业服务安排的通知', '各位租户：春节期间（1月28日-2月4日），物业服务热线正常开通，紧急维修可拨打24小时值班电话。', '2026-01-20'),
    ('公寓公共区域WiFi升级公告', '为提升租户上网体验，公寓将于2月15日对公共区域WiFi进行升级，届时可能会有短暂中断。', '2026-02-10'),
    ('3月消防安全演练通知', '根据消防部门要求，公寓将于3月20日下午14:00进行消防安全演练，请各位租户积极参与。', '2026-03-10'),
    ('F栋新楼正式开放入住公告', 'F栋装修全面完工，即日起开放预约看房，首批入住可享首月租金8折优惠。', '2026-03-15'),
    ('关于调整水电费计费方式的通知', '自2026年4月1日起，水电费将采用阶梯计费方式，具体标准详见公告栏。', '2026-03-22')`)

  console.log('插入公告: 5 条')

  // 验证
  const [h] = await pool.query('SELECT COUNT(*) as cnt FROM houses')
  const [u] = await pool.query('SELECT COUNT(*) as cnt FROM users')
  const [o] = await pool.query('SELECT COUNT(*) as cnt FROM orders')
  const [c] = await pool.query('SELECT COUNT(*) as cnt FROM contracts')
  const [p] = await pool.query('SELECT COUNT(*) as cnt FROM payments')
  console.log(`\n验证: 房源${h[0].cnt}条, 用户${u[0].cnt}条, 订单${o[0].cnt}条, 合同${c[0].cnt}条, 缴费${p[0].cnt}条`)
  console.log('全部数据导入完成！')

  await pool.end()
}

migrate().catch(err => {
  console.error('导入失败:', err.message)
  process.exit(1)
})
