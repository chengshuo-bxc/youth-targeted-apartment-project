// 青年公寓模拟数据

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
  'https://images.unsplash.com/photo-1598928506311-c55ez324a6e3?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop',
]

function pick3(id) {
  const a = (id * 3) % imgPool.length
  return [imgPool[a], imgPool[(a + 4) % imgPool.length], imgPool[(a + 7) % imgPool.length]]
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

// 房源列表 - 70条
export const rooms = [
  // ===== A栋 (12间) =====
  { id: 1, title: '阳光精品单间A-101', type: '单间', area: 25, floor: '1层', price: 1200, deposit: 1200, status: 'available', tags: ['近地铁', '独立卫浴', '朝南'], description: '位于A栋1层，采光充足，配备独立卫浴、空调、热水器、衣柜、书桌椅等家具家电。距地铁站步行5分钟。', images: pick3(1), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('A','101'), createTime: '2026-01-15' },
  { id: 2, title: '标准单间A-202', type: '单间', area: 22, floor: '2层', price: 1000, deposit: 1000, status: 'available', tags: ['独立卫浴', 'WiFi', '朝南'], description: 'A栋2层标准单间，南北通透，采光良好。配备独立卫浴和基础家电，性价比高。', images: pick3(2), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('A','202'), createTime: '2026-03-10' },
  { id: 3, title: '雅致单间A-301', type: '单间', area: 28, floor: '3层', price: 1300, deposit: 1300, status: 'available', tags: ['朝南', '独立卫浴', '近商圈'], description: 'A栋3层雅致单间，暖色调装修风格，搭配原木家具，独立卫浴干湿分离。', images: pick3(3), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('A','301'), createTime: '2026-01-25' },
  { id: 4, title: '豪华大床房A-401', type: '单间', area: 30, floor: '4层', price: 1500, deposit: 1500, status: 'reserved', tags: ['大阳台', '朝南', '高层视野'], description: 'A栋4层豪华单间，1.8m大床，超大观景阳台，装修精致。', images: pick3(4), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '独立卫浴', '衣柜', '大阳台'], address: addr('A','401'), createTime: '2026-02-10' },
  { id: 5, title: '双人间A-501', type: '双人间', area: 38, floor: '5层', price: 1600, deposit: 1600, status: 'available', tags: ['近地铁', '高层视野', '可短租'], description: 'A栋5层宽敞双人间，两张1.5m大床，高层采光好，窗外视野开阔。', images: pick3(5), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜x2', '书桌椅x2'], address: addr('A','501'), createTime: '2026-02-18' },
  { id: 6, title: '精品一室一厅A-601', type: '一室一厅', area: 38, floor: '6层', price: 1900, deposit: 1900, status: 'available', tags: ['高层', '朝南', '拎包入住'], description: 'A栋6层精品一室一厅，高层朝南，采光通风一流，装修简约时尚。', images: pick3(6), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('A','601'), createTime: '2026-03-12' },
  { id: 7, title: '温馨一室一厅A-302', type: '一室一厅', area: 35, floor: '3层', price: 1700, deposit: 1700, status: 'rented', tags: ['拎包入住', '近商圈', '朝东'], description: 'A栋3层温馨一室一厅，暖色灯光搭配米白墙面，营造温馨居家感。', images: pick3(7), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '独立卫浴'], address: addr('A','302'), createTime: '2026-01-20' },
  { id: 8, title: '经济单间A-103', type: '单间', area: 18, floor: '1层', price: 750, deposit: 750, status: 'available', tags: ['超低价', '月付', '近公交'], description: 'A栋1层经济单间，面积紧凑但功能齐全，适合预算有限的年轻人。', images: pick3(8), facilities: ['空调', '热水器', 'WiFi', '公共卫浴', '衣柜', '书桌'], address: addr('A','103'), createTime: '2026-02-05' },
  { id: 9, title: '舒适双人间A-402', type: '双人间', area: 34, floor: '4层', price: 1400, deposit: 1400, status: 'available', tags: ['独立卫浴', '可短租', '近地铁'], description: 'A栋4层舒适双人间，两张1.2m单人床，适合同学合住。', images: pick3(9), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜x2', '书桌椅x2'], address: addr('A','402'), createTime: '2026-02-15' },
  { id: 10, title: '宽敞一室一厅A-502', type: '一室一厅', area: 42, floor: '5层', price: 2000, deposit: 2000, status: 'available', tags: ['精装修', '大阳台', '高层视野'], description: 'A栋5层宽敞一室一厅，客厅面积大，适合居家办公。', images: pick3(10), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '大阳台'], address: addr('A','502'), createTime: '2026-02-20' },
  { id: 11, title: '单间A-203', type: '单间', area: 24, floor: '2层', price: 1100, deposit: 1100, status: 'available', tags: ['近地铁', '独立卫浴', '朝东'], description: 'A栋2层标准单间，简约装修，基础家电齐全，通勤便利。', images: pick3(11), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('A','203'), createTime: '2026-03-01' },
  { id: 12, title: '两室一厅A-602', type: '两室一厅', area: 58, floor: '6层', price: 2600, deposit: 2600, status: 'rented', tags: ['整租', '高层', '采光好'], description: 'A栋6层两室一厅，高层双卧室朝南，客厅宽敞，适合三人合租。', images: pick3(12), facilities: ['空调x2', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('A','602'), createTime: '2026-02-08' },

  // ===== B栋 (12间) =====
  { id: 13, title: '温馨一室一厅B-205', type: '一室一厅', area: 40, floor: '2层', price: 1800, deposit: 1800, status: 'available', tags: ['拎包入住', '朝南', '采光好'], description: 'B栋2层精装一室一厅，客厅宽敞明亮，全套家具家电。', images: pick3(13), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机'], address: addr('B','205'), createTime: '2026-01-20' },
  { id: 14, title: '经济单间B-103', type: '单间', area: 20, floor: '1层', price: 800, deposit: 800, status: 'available', tags: ['经济实惠', '近公交', '朝北'], description: 'B栋1层经济单间，价格实惠，配备基本家具家电。', images: pick3(14), facilities: ['空调', '热水器', 'WiFi', '公共卫浴', '衣柜', '书桌'], address: addr('B','103'), createTime: '2026-03-01' },
  { id: 15, title: '舒适两室一厅B-401', type: '两室一厅', area: 55, floor: '4层', price: 2500, deposit: 2500, status: 'available', tags: ['整租', '朝南', '拎包入住'], description: 'B栋4层舒适两室一厅，两个朝南卧室，采光优秀。', images: pick3(15), facilities: ['空调x2', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('B','401'), createTime: '2026-02-05' },
  { id: 16, title: '迷你单间B-301', type: '单间', area: 18, floor: '3层', price: 750, deposit: 750, status: 'available', tags: ['超低价', '月付', '近公交'], description: 'B栋3层迷你单间，面积紧凑但功能齐全。', images: pick3(16), facilities: ['空调', '热水器', 'WiFi', '公共卫浴', '衣柜', '书桌'], address: addr('B','301'), createTime: '2026-02-28' },
  { id: 17, title: '豪华单间B-501', type: '单间', area: 32, floor: '5层', price: 1600, deposit: 1600, status: 'available', tags: ['朝南', '大阳台', '精装修'], description: 'B栋5层豪华单间，1.8m大床，落地窗设计，视野开阔。', images: pick3(17), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '独立卫浴', '衣柜', '大阳台', '书桌椅'], address: addr('B','501'), createTime: '2026-03-05' },
  { id: 18, title: '一室一厅B-302', type: '一室一厅', area: 38, floor: '3层', price: 1750, deposit: 1750, status: 'rented', tags: ['拎包入住', '近商圈', '可短租'], description: 'B栋3层一室一厅，配套齐全，适合短期租住。', images: pick3(18), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '独立卫浴'], address: addr('B','302'), createTime: '2026-02-12' },
  { id: 19, title: '双人间B-201', type: '双人间', area: 36, floor: '2层', price: 1450, deposit: 1450, status: 'available', tags: ['独立卫浴', '近地铁', '可短租'], description: 'B栋2层双人间，两张单人床，独立卫浴，适合同学合住。', images: pick3(19), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜x2', '书桌椅x2'], address: addr('B','201'), createTime: '2026-02-25' },
  { id: 20, title: '单间B-102', type: '单间', area: 22, floor: '1层', price: 900, deposit: 900, status: 'available', tags: ['经济实惠', 'WiFi', '月付'], description: 'B栋1层单间，价格实惠，适合刚入职的年轻人。', images: pick3(20), facilities: ['空调', '热水器', 'WiFi', '公共卫浴', '衣柜', '书桌椅'], address: addr('B','102'), createTime: '2026-03-08' },
  { id: 21, title: '两室一厅B-502', type: '两室一厅', area: 62, floor: '5层', price: 2700, deposit: 2700, status: 'available', tags: ['整租', '高层视野', '朝南'], description: 'B栋5层宽敞两室一厅，客厅可放餐桌，适合小家庭。', images: pick3(21), facilities: ['空调x2', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('B','502'), createTime: '2026-03-02' },
  { id: 22, title: '女生单间B-402', type: '单间', area: 23, floor: '4层', price: 1050, deposit: 1050, status: 'available', tags: ['仅限女生', '独立卫浴', '近商圈'], description: 'B栋4层女生专属单间，整层女生住户，安全管理严格。', images: pick3(22), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅', '梳妆台'], address: addr('B','402'), createTime: '2026-03-10' },
  { id: 23, title: '一室一厅B-601', type: '一室一厅', area: 44, floor: '6层', price: 2100, deposit: 2100, status: 'reserved', tags: ['精装修', '高层', '拎包入住'], description: 'B栋6层一室一厅，全新装修，品牌家电，居住体验佳。', images: pick3(23), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('B','601'), createTime: '2026-03-15' },
  { id: 24, title: '三室一厅B-602', type: '三室一厅', area: 88, floor: '6层', price: 3800, deposit: 3800, status: 'available', tags: ['整租', '高层', '采光好'], description: 'B栋6层大三室一厅，三卧室均朝南，适合家庭居住或多人合租。', images: pick3(24), facilities: ['空调x3', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('B','602'), createTime: '2026-02-18' },

  // ===== C栋 (12间) =====
  { id: 25, title: '简约双人间C-302', type: '双人间', area: 35, floor: '3层', price: 1500, deposit: 1500, status: 'available', tags: ['近地铁', '独立卫浴', '可短租'], description: 'C栋3层标准双人间，两张1.2m单人床，干湿分离独立卫浴。', images: pick3(25), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('C','302'), createTime: '2026-02-01' },
  { id: 26, title: '女生单间C-201', type: '单间', area: 23, floor: '2层', price: 1100, deposit: 1100, status: 'available', tags: ['仅限女生', '近地铁', '独立卫浴'], description: 'C栋2层女生专属单间，粉色系装修，配备梳妆台。', images: pick3(26), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅', '梳妆台'], address: addr('C','201'), createTime: '2026-02-08' },
  { id: 27, title: '精品套房C-403', type: '一室一厅', area: 45, floor: '4层', price: 2000, deposit: 2000, status: 'available', tags: ['精装修', '近地铁', '拎包入住'], description: 'C栋4层精品一室一厅，全新装修，环保材料，品牌家电。', images: pick3(27), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('C','403'), createTime: '2026-03-15' },
  { id: 28, title: '合租床位C-501', type: '床位', area: 15, floor: '5层', price: 550, deposit: 550, status: 'available', tags: ['超低价', '女生层', '近地铁'], description: 'C栋5层女生合租床位，六人间配置（实际住4人），环境整洁。', images: pick3(28), facilities: ['空调', '热水器', 'WiFi', '公共厨房', '公共洗衣房', '储物柜', '公共阳台'], address: addr('C','501'), createTime: '2026-03-18' },
  { id: 29, title: '单间C-102', type: '单间', area: 21, floor: '1层', price: 850, deposit: 850, status: 'available', tags: ['经济实惠', '近公交', '朝东'], description: 'C栋1层单间，采光不错，配备基础家电。', images: pick3(29), facilities: ['空调', '热水器', 'WiFi', '公共卫浴', '衣柜', '书桌'], address: addr('C','102'), createTime: '2026-03-05' },
  { id: 30, title: '一室一厅C-301', type: '一室一厅', area: 40, floor: '3层', price: 1850, deposit: 1850, status: 'rented', tags: ['朝南', '独立卫浴', '近商圈'], description: 'C栋3层一室一厅，装修温馨，适合年轻情侣。', images: pick3(30), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '独立卫浴'], address: addr('C','301'), createTime: '2026-02-10' },
  { id: 31, title: '双人间C-401', type: '双人间', area: 33, floor: '4层', price: 1350, deposit: 1350, status: 'available', tags: ['独立卫浴', '可短租', '朝南'], description: 'C栋4层双人间，空间宽敞，采光好，适合好友合住。', images: pick3(31), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜x2', '书桌椅x2'], address: addr('C','401'), createTime: '2026-02-22' },
  { id: 32, title: '合租床位C-601', type: '床位', area: 15, floor: '6层', price: 500, deposit: 500, status: 'available', tags: ['超低价', '月付', '近公交'], description: 'C栋6层合租床位，四人间配置，公共设施齐全。', images: pick3(32), facilities: ['空调', '热水器', 'WiFi', '公共厨房', '公共洗衣房', '储物柜'], address: addr('C','601'), createTime: '2026-03-12' },
  { id: 33, title: '单间C-202', type: '单间', area: 26, floor: '2层', price: 1150, deposit: 1150, status: 'available', tags: ['朝南', '独立卫浴', '近地铁'], description: 'C栋2层标准单间，装修简约，独立卫浴。', images: pick3(33), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('C','202'), createTime: '2026-03-08' },
  { id: 34, title: '两室一厅C-502', type: '两室一厅', area: 52, floor: '5层', price: 2400, deposit: 2400, status: 'available', tags: ['整租', '采光好', '拎包入住'], description: 'C栋5层两室一厅，两个卧室大小适中，客厅采光好。', images: pick3(34), facilities: ['空调x2', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('C','502'), createTime: '2026-03-01' },
  { id: 35, title: '一室一厅C-103', type: '一室一厅', area: 36, floor: '1层', price: 1650, deposit: 1650, status: 'available', tags: ['近商圈', '拎包入住', '朝东'], description: 'C栋1层一室一厅，出入方便，配套齐全。', images: pick3(35), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('C','103'), createTime: '2026-03-18' },
  { id: 36, title: 'LOFT单间C-602', type: 'LOFT', area: 40, floor: '6层', price: 2100, deposit: 2100, status: 'reserved', tags: ['LOFT', '高层', '工业风'], description: 'C栋6层LOFT单间，上层卧室下层活动区，个性装修。', images: pick3(36), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('C','602'), createTime: '2026-03-20' },

  // ===== D栋 (12间) =====
  { id: 37, title: '精装两室一厅D-501', type: '两室一厅', area: 60, floor: '5层', price: 2800, deposit: 2800, status: 'rented', tags: ['整租', '采光好', '近商圈'], description: 'D栋5层精装两室一厅，两个卧室均配独立衣柜，客厅餐厅一体。', images: pick3(37), facilities: ['空调x2', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机'], address: addr('D','501'), createTime: '2026-02-15' },
  { id: 38, title: '合租床位D-602', type: '床位', area: 15, floor: '6层', price: 600, deposit: 600, status: 'available', tags: ['超低价', '近地铁', '月付'], description: 'D栋6层合租床位，四人间配置，公共区域宽敞。', images: pick3(38), facilities: ['空调', '热水器', 'WiFi', '公共厨房', '公共洗衣房', '储物柜'], address: addr('D','602'), createTime: '2026-03-20' },
  { id: 39, title: '三室一厅D-301', type: '三室一厅', area: 85, floor: '3层', price: 3600, deposit: 3600, status: 'available', tags: ['整租', '采光好', '近地铁'], description: 'D栋3层大三室一厅，三个卧室均有窗户，通风采光好。', images: pick3(39), facilities: ['空调x3', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('D','301'), createTime: '2026-02-22' },
  { id: 40, title: '单间D-101', type: '单间', area: 24, floor: '1层', price: 950, deposit: 950, status: 'available', tags: ['经济实惠', 'WiFi', '近公交'], description: 'D栋1层单间，出入方便，配备基础家电。', images: pick3(40), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('D','101'), createTime: '2026-02-28' },
  { id: 41, title: '双人间D-202', type: '双人间', area: 36, floor: '2层', price: 1550, deposit: 1550, status: 'available', tags: ['独立卫浴', '近商圈', '可短租'], description: 'D栋2层双人间，空间充裕，采光良好。', images: pick3(41), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜x2', '书桌椅x2'], address: addr('D','202'), createTime: '2026-03-02' },
  { id: 42, title: '一室一厅D-302', type: '一室一厅', area: 42, floor: '3层', price: 1950, deposit: 1950, status: 'available', tags: ['朝南', '拎包入住', '近地铁'], description: 'D栋3层一室一厅，客厅宽敞，装修现代。', images: pick3(42), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('D','302'), createTime: '2026-03-06' },
  { id: 43, title: '两室一厅D-401', type: '两室一厅', area: 56, floor: '4层', price: 2650, deposit: 2650, status: 'available', tags: ['整租', '朝南', '采光好'], description: 'D栋4层两室一厅，适合好友或小家庭居住。', images: pick3(43), facilities: ['空调x2', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('D','401'), createTime: '2026-03-10' },
  { id: 44, title: '单间D-502', type: '单间', area: 27, floor: '5层', price: 1250, deposit: 1250, status: 'available', tags: ['朝南', '独立卫浴', '高层视野'], description: 'D栋5层单间，高层采光好，视野开阔。', images: pick3(44), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('D','502'), createTime: '2026-03-15' },
  { id: 45, title: '合租床位D-102', type: '床位', area: 15, floor: '1层', price: 580, deposit: 580, status: 'available', tags: ['超低价', '月付', '近公交'], description: 'D栋1层合租床位，四人间，公共厨房和洗衣房。', images: pick3(45), facilities: ['空调', '热水器', 'WiFi', '公共厨房', '公共洗衣房', '储物柜'], address: addr('D','102'), createTime: '2026-03-18' },
  { id: 46, title: 'LOFT一室一厅D-601', type: 'LOFT', area: 48, floor: '6层', price: 2300, deposit: 2300, status: 'available', tags: ['LOFT', '高层视野', '工业风'], description: 'D栋6层LOFT户型，上层卧室下层客厅，工业风个性装修。', images: pick3(46), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '独立卫浴', '开放式厨房'], address: addr('D','601'), createTime: '2026-02-20' },
  { id: 47, title: '单间D-201', type: '单间', area: 23, floor: '2层', price: 1050, deposit: 1050, status: 'rented', tags: ['独立卫浴', '近地铁', '朝东'], description: 'D栋2层单间，装修干净整洁，通勤方便。', images: pick3(47), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('D','201'), createTime: '2026-02-15' },
  { id: 48, title: '三室一厅D-503', type: '三室一厅', area: 90, floor: '5层', price: 3900, deposit: 3900, status: 'available', tags: ['整租', '采光好', '大客厅'], description: 'D栋5层大三室一厅，客厅面积大，适合家庭或多人合租。', images: pick3(48), facilities: ['空调x3', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('D','503'), createTime: '2026-03-08' },

  // ===== E栋 (12间) =====
  { id: 49, title: 'LOFT复式公寓E-201', type: 'LOFT', area: 45, floor: '2层', price: 2200, deposit: 2200, status: 'available', tags: ['LOFT', '层高3.6m', '工业风'], description: 'E栋LOFT复式户型，层高3.6米，上层卧室下层客厅，工业风装修。', images: pick3(49), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '独立卫浴'], address: addr('E','201'), createTime: '2026-03-05' },
  { id: 50, title: '轻奢一室一厅E-301', type: '一室一厅', area: 42, floor: '3层', price: 2100, deposit: 2100, status: 'rented', tags: ['精装修', '大阳台', '近商圈'], description: 'E栋3层轻奢一室一厅，智能门锁、智能灯光，超大阳台。', images: pick3(50), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '智能门锁', '大阳台'], address: addr('E','301'), createTime: '2026-02-12' },
  { id: 51, title: 'LOFT双人居E-401', type: 'LOFT', area: 50, floor: '4层', price: 2500, deposit: 2500, status: 'reserved', tags: ['LOFT', '可住两人', '工业风'], description: 'E栋4层LOFT双人居，上下层卧室区域，开放式厨房，拍照打卡圣地。', images: pick3(51), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '油烟机', '独立卫浴', '开放式厨房'], address: addr('E','401'), createTime: '2026-03-08' },
  { id: 52, title: '单间E-101', type: '单间', area: 24, floor: '1层', price: 1000, deposit: 1000, status: 'available', tags: ['近地铁', '独立卫浴', '朝南'], description: 'E栋1层单间，简约装修，配套齐全，交通便利。', images: pick3(52), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('E','101'), createTime: '2026-02-20' },
  { id: 53, title: '一室一厅E-202', type: '一室一厅', area: 39, floor: '2层', price: 1900, deposit: 1900, status: 'available', tags: ['朝南', '拎包入住', '近商圈'], description: 'E栋2层一室一厅，装修现代简约，全套家具。', images: pick3(53), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('E','202'), createTime: '2026-03-01' },
  { id: 54, title: '两室一厅E-302', type: '两室一厅', area: 58, floor: '3层', price: 2700, deposit: 2700, status: 'available', tags: ['整租', '精装修', '采光好'], description: 'E栋3层两室一厅，品牌装修，两个卧室朝南。', images: pick3(54), facilities: ['空调x2', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('E','302'), createTime: '2026-03-05' },
  { id: 55, title: '双人间E-301', type: '双人间', area: 37, floor: '3层', price: 1500, deposit: 1500, status: 'available', tags: ['独立卫浴', '近地铁', '可短租'], description: 'E栋3层双人间，空间宽敞，适合同学或好友同住。', images: pick3(55), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜x2', '书桌椅x2'], address: addr('E','301'), createTime: '2026-03-10' },
  { id: 56, title: '单间E-402', type: '单间', area: 22, floor: '4层', price: 980, deposit: 980, status: 'available', tags: ['经济实惠', 'WiFi', '独立卫浴'], description: 'E栋4层经济单间，价格实惠，独立卫浴。', images: pick3(56), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('E','402'), createTime: '2026-03-12' },
  { id: 57, title: 'LOFT三室E-501', type: '三室一厅', area: 95, floor: '5层', price: 4000, deposit: 4000, status: 'available', tags: ['LOFT', '整租', '大空间'], description: 'E栋5层LOFT三室，超大空间，适合多人合租或小家庭。', images: pick3(57), facilities: ['空调x3', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2', '开放式厨房'], address: addr('E','501'), createTime: '2026-03-15' },
  { id: 58, title: '女生单间E-201', type: '单间', area: 24, floor: '2层', price: 1080, deposit: 1080, status: 'available', tags: ['仅限女生', '独立卫浴', '近地铁'], description: 'E栋2层女生单间，粉色系装修，安全性高。', images: pick3(58), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅', '梳妆台'], address: addr('E','201'), createTime: '2026-03-18' },
  { id: 59, title: '一室一厅E-502', type: '一室一厅', area: 41, floor: '5层', price: 2050, deposit: 2050, status: 'available', tags: ['高层', '朝南', '精装修'], description: 'E栋5层一室一厅，高层视野好，装修精美。', images: pick3(59), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('E','502'), createTime: '2026-03-20' },
  { id: 60, title: '合租床位E-601', type: '床位', area: 15, floor: '6层', price: 520, deposit: 520, status: 'available', tags: ['超低价', '月付', '近公交'], description: 'E栋6层合租床位，四人间配置，公共设施齐全。', images: pick3(60), facilities: ['空调', '热水器', 'WiFi', '公共厨房', '公共洗衣房', '储物柜'], address: addr('E','601'), createTime: '2026-03-22' },

  // ===== F栋 (10间) =====
  { id: 61, title: '阳光单间F-101', type: '单间', area: 26, floor: '1层', price: 1150, deposit: 1150, status: 'available', tags: ['朝南', '独立卫浴', '近地铁'], description: 'F栋1层阳光单间，采光充足，装修温馨。', images: pick3(61), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜', '书桌椅'], address: addr('F','101'), createTime: '2026-03-01' },
  { id: 62, title: '一室一厅F-201', type: '一室一厅', area: 40, floor: '2层', price: 1850, deposit: 1850, status: 'available', tags: ['拎包入住', '近商圈', '朝南'], description: 'F栋2层一室一厅，全套品牌家电，入住即享。', images: pick3(62), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('F','201'), createTime: '2026-03-05' },
  { id: 63, title: '双人间F-301', type: '双人间', area: 35, floor: '3层', price: 1450, deposit: 1450, status: 'available', tags: ['独立卫浴', '可短租', '近地铁'], description: 'F栋3层双人间，空间适中，适合合住。', images: pick3(63), facilities: ['空调', '热水器', 'WiFi', '独立卫浴', '衣柜x2', '书桌椅x2'], address: addr('F','301'), createTime: '2026-03-08' },
  { id: 64, title: '两室一厅F-401', type: '两室一厅', area: 55, floor: '4层', price: 2550, deposit: 2550, status: 'available', tags: ['整租', '朝南', '采光好'], description: 'F栋4层两室一厅，装修干净整洁，适合合租。', images: pick3(64), facilities: ['空调x2', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('F','401'), createTime: '2026-03-10' },
  { id: 65, title: 'LOFT一室F-501', type: 'LOFT', area: 43, floor: '5层', price: 2250, deposit: 2250, status: 'rented', tags: ['LOFT', '高层视野', '工业风'], description: 'F栋5层LOFT户型，个性装修，高层采光好。', images: pick3(65), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '独立卫浴'], address: addr('F','501'), createTime: '2026-02-25' },
  { id: 66, title: '单间F-202', type: '单间', area: 20, floor: '2层', price: 880, deposit: 880, status: 'available', tags: ['经济实惠', '月付', '近公交'], description: 'F栋2层经济单间，价格实惠，适合短期过渡。', images: pick3(66), facilities: ['空调', '热水器', 'WiFi', '公共卫浴', '衣柜', '书桌'], address: addr('F','202'), createTime: '2026-03-12' },
  { id: 67, title: '一室一厅F-302', type: '一室一厅', area: 38, floor: '3层', price: 1800, deposit: 1800, status: 'available', tags: ['朝南', '拎包入住', '近商圈'], description: 'F栋3层一室一厅，配套齐全，居住方便。', images: pick3(67), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴'], address: addr('F','302'), createTime: '2026-03-15' },
  { id: 68, title: '合租床位F-601', type: '床位', area: 15, floor: '6层', price: 560, deposit: 560, status: 'available', tags: ['超低价', '近地铁', '月付'], description: 'F栋6层合租床位，四人间，配备公共厨房和洗衣房。', images: pick3(68), facilities: ['空调', '热水器', 'WiFi', '公共厨房', '公共洗衣房', '储物柜'], address: addr('F','601'), createTime: '2026-03-18' },
  { id: 69, title: '三室一厅F-402', type: '三室一厅', area: 82, floor: '4层', price: 3500, deposit: 3500, status: 'available', tags: ['整租', '采光好', '拎包入住'], description: 'F栋4层三室一厅，三个卧室布局合理，客厅宽敞。', images: pick3(69), facilities: ['空调x3', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '独立卫浴x2'], address: addr('F','402'), createTime: '2026-03-20' },
  { id: 70, title: '豪华一室一厅F-502', type: '一室一厅', area: 46, floor: '5层', price: 2300, deposit: 2300, status: 'reserved', tags: ['精装修', '大阳台', '高层视野'], description: 'F栋5层豪华一室一厅，全景落地窗，品牌装修，享受品质生活。', images: pick3(70), facilities: ['空调', '热水器', '洗衣机', 'WiFi', '冰箱', '电视', '燃气灶', '油烟机', '智能门锁', '大阳台', '独立卫浴'], address: addr('F','502'), createTime: '2026-03-22' },
]

// 用户列表 - 27人
export const users = [
  // 管理员
  { id: 1, name: '程烁', phone: '13800138001', idCard: '410***********1234', role: 'admin', gender: '男', age: 22, avatar: '', status: 'active', createTime: '2026-01-01' },
  // 管家
  { id: 2, name: '管家小李', phone: '13800138002', idCard: '410***********2345', role: 'manager', gender: '男', age: 30, avatar: '', status: 'active', createTime: '2026-01-05' },
  // 租客 (25人)
  { id: 3, name: '张三', phone: '13800138003', idCard: '410***********5678', role: 'tenant', gender: '男', age: 24, avatar: '', status: 'active', createTime: '2026-01-15' },
  { id: 4, name: '李四', phone: '13800138004', idCard: '410***********9012', role: 'tenant', gender: '女', age: 23, avatar: '', status: 'active', createTime: '2026-02-01' },
  { id: 5, name: '王五', phone: '13800138005', idCard: '410***********3456', role: 'tenant', gender: '男', age: 25, avatar: '', status: 'active', createTime: '2026-02-10' },
  { id: 6, name: '赵六', phone: '13800138006', idCard: '410***********7890', role: 'tenant', gender: '女', age: 22, avatar: '', status: 'inactive', createTime: '2026-02-20' },
  { id: 7, name: '孙七', phone: '13800138007', idCard: '410***********6789', role: 'tenant', gender: '女', age: 24, avatar: '', status: 'active', createTime: '2026-03-01' },
  { id: 8, name: '周八', phone: '13800138008', idCard: '410***********0123', role: 'tenant', gender: '男', age: 26, avatar: '', status: 'active', createTime: '2026-03-05' },
  { id: 9, name: '吴九', phone: '13800138009', idCard: '410***********4567', role: 'tenant', gender: '女', age: 23, avatar: '', status: 'active', createTime: '2026-03-10' },
  { id: 10, name: '郑十', phone: '13800138010', idCard: '410***********8901', role: 'tenant', gender: '男', age: 22, avatar: '', status: 'active', createTime: '2026-03-15' },
  { id: 11, name: '陈雨', phone: '13800138011', idCard: '410***********1111', role: 'tenant', gender: '女', age: 24, avatar: '', status: 'active', createTime: '2026-01-20' },
  { id: 12, name: '刘洋', phone: '13800138012', idCard: '410***********2222', role: 'tenant', gender: '男', age: 25, avatar: '', status: 'active', createTime: '2026-01-25' },
  { id: 13, name: '杨芳', phone: '13800138013', idCard: '410***********3333', role: 'tenant', gender: '女', age: 23, avatar: '', status: 'active', createTime: '2026-02-05' },
  { id: 14, name: '黄磊', phone: '13800138014', idCard: '410***********4444', role: 'tenant', gender: '男', age: 27, avatar: '', status: 'active', createTime: '2026-02-08' },
  { id: 15, name: '何静', phone: '13800138015', idCard: '410***********5555', role: 'tenant', gender: '女', age: 22, avatar: '', status: 'active', createTime: '2026-02-15' },
  { id: 16, name: '马超', phone: '13800138016', idCard: '410***********6666', role: 'tenant', gender: '男', age: 26, avatar: '', status: 'active', createTime: '2026-02-18' },
  { id: 17, name: '林雪', phone: '13800138017', idCard: '410***********7777', role: 'tenant', gender: '女', age: 24, avatar: '', status: 'active', createTime: '2026-02-25' },
  { id: 18, name: '徐明', phone: '13800138018', idCard: '410***********8888', role: 'tenant', gender: '男', age: 28, avatar: '', status: 'active', createTime: '2026-03-01' },
  { id: 19, name: '高悦', phone: '13800138019', idCard: '410***********9999', role: 'tenant', gender: '女', age: 23, avatar: '', status: 'active', createTime: '2026-03-05' },
  { id: 20, name: '罗辉', phone: '13800138020', idCard: '410***********0001', role: 'tenant', gender: '男', age: 25, avatar: '', status: 'active', createTime: '2026-03-08' },
  { id: 21, name: '梁婷', phone: '13800138021', idCard: '410***********0002', role: 'tenant', gender: '女', age: 22, avatar: '', status: 'active', createTime: '2026-03-10' },
  { id: 22, name: '谢军', phone: '13800138022', idCard: '410***********0003', role: 'tenant', gender: '男', age: 24, avatar: '', status: 'inactive', createTime: '2026-03-12' },
  { id: 23, name: '韩雪', phone: '13800138023', idCard: '410***********0004', role: 'tenant', gender: '女', age: 25, avatar: '', status: 'active', createTime: '2026-03-15' },
  { id: 24, name: '唐浩', phone: '13800138024', idCard: '410***********0005', role: 'tenant', gender: '男', age: 23, avatar: '', status: 'active', createTime: '2026-03-18' },
  { id: 25, name: '冯萍', phone: '13800138025', idCard: '410***********0006', role: 'tenant', gender: '女', age: 26, avatar: '', status: 'active', createTime: '2026-03-20' },
  { id: 26, name: '董强', phone: '13800138026', idCard: '410***********0007', role: 'tenant', gender: '男', age: 27, avatar: '', status: 'active', createTime: '2026-03-22' },
  { id: 27, name: '程颖', phone: '13800138027', idCard: '410***********0008', role: 'tenant', gender: '女', age: 21, avatar: '', status: 'active', createTime: '2026-03-25' },
]

// 订单列表 - 17条
export const orders = [
  { id: 1, userId: 3, userName: '张三', roomId: 1, roomTitle: '阳光精品单间A-101', type: '预订', status: 'completed', createTime: '2026-02-01', checkIn: '2026-02-15', checkOut: '2027-02-14', remark: '希望安排低楼层' },
  { id: 2, userId: 4, userName: '李四', roomId: 13, roomTitle: '温馨一室一厅B-205', type: '预订', status: 'active', createTime: '2026-02-10', checkIn: '2026-03-01', checkOut: '2027-02-28', remark: '' },
  { id: 3, userId: 5, userName: '王五', roomId: 4, roomTitle: '豪华大床房A-401', type: '预订', status: 'pending', createTime: '2026-03-10', checkIn: '2026-04-01', checkOut: '2027-03-31', remark: '需要停车位' },
  { id: 4, userId: 3, userName: '张三', roomId: 37, roomTitle: '精装两室一厅D-501', type: '退租', status: 'cancelled', createTime: '2026-01-20', checkIn: '2025-06-01', checkOut: '2026-05-31', remark: '工作调动' },
  { id: 5, userId: 7, userName: '孙七', roomId: 50, roomTitle: '轻奢一室一厅E-301', type: '预订', status: 'completed', createTime: '2026-02-12', checkIn: '2026-03-01', checkOut: '2027-02-28', remark: '' },
  { id: 6, userId: 8, userName: '周八', roomId: 39, roomTitle: '三室一厅D-301', type: '预订', status: 'active', createTime: '2026-02-25', checkIn: '2026-03-15', checkOut: '2027-03-14', remark: '三人合租' },
  { id: 7, userId: 9, userName: '吴九', roomId: 51, roomTitle: 'LOFT双人居E-401', type: '预订', status: 'pending', createTime: '2026-03-08', checkIn: '2026-04-15', checkOut: '2027-04-14', remark: '和室友一起住' },
  { id: 8, userId: 10, userName: '郑十', roomId: 6, roomTitle: '精品一室一厅A-601', type: '预订', status: 'active', createTime: '2026-03-12', checkIn: '2026-04-01', checkOut: '2027-03-31', remark: '' },
  { id: 9, userId: 11, userName: '陈雨', roomId: 7, roomTitle: '温馨一室一厅A-302', type: '预订', status: 'completed', createTime: '2026-01-18', checkIn: '2026-02-01', checkOut: '2027-01-31', remark: '' },
  { id: 10, userId: 12, userName: '刘洋', roomId: 12, roomTitle: '两室一厅A-602', type: '预订', status: 'completed', createTime: '2026-02-05', checkIn: '2026-02-20', checkOut: '2027-02-19', remark: '朋友合租' },
  { id: 11, userId: 14, userName: '黄磊', roomId: 30, roomTitle: '一室一厅C-301', type: '预订', status: 'completed', createTime: '2026-02-08', checkIn: '2026-03-01', checkOut: '2027-02-28', remark: '' },
  { id: 12, userId: 16, userName: '马超', roomId: 18, roomTitle: '一室一厅B-302', type: '预订', status: 'completed', createTime: '2026-02-10', checkIn: '2026-03-01', checkOut: '2027-02-28', remark: '可短租' },
  { id: 13, userId: 18, userName: '徐明', roomId: 65, roomTitle: 'LOFT一室F-501', type: '预订', status: 'completed', createTime: '2026-02-22', checkIn: '2026-03-10', checkOut: '2027-03-09', remark: '' },
  { id: 14, userId: 20, userName: '罗辉', roomId: 47, roomTitle: '单间D-201', type: '预订', status: 'completed', createTime: '2026-02-12', checkIn: '2026-03-01', checkOut: '2027-02-28', remark: '' },
  { id: 15, userId: 15, userName: '何静', roomId: 36, roomTitle: 'LOFT单间C-602', type: '预订', status: 'pending', createTime: '2026-03-20', checkIn: '2026-04-20', checkOut: '2027-04-19', remark: '喜欢LOFT风格' },
  { id: 16, userId: 24, userName: '唐浩', roomId: 23, roomTitle: '一室一厅B-601', type: '预订', status: 'pending', createTime: '2026-03-15', checkIn: '2026-05-01', checkOut: '2027-04-30', remark: '' },
  { id: 17, userId: 26, userName: '董强', roomId: 70, roomTitle: '豪华一室一厅F-502', type: '预订', status: 'active', createTime: '2026-03-22', checkIn: '2026-04-15', checkOut: '2027-04-14', remark: '需要高层' },
]

// 合同列表
export const contracts = [
  { id: 1, orderId: 1, userId: 3, userName: '张三', roomId: 1, roomTitle: '阳光精品单间A-101', startDate: '2026-02-15', endDate: '2027-02-14', rent: 1200, deposit: 1200, status: 'active', signDate: '2026-02-14', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：张三\n\n第一条 租赁房屋\n甲方将位于郑州市高新区科学大道100号A栋101号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年2月15日至2027年2月14日，共计1年。\n\n第三条 租金及押金\n月租金为人民币1200元，押金为人民币1200元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 2, orderId: 2, userId: 4, userName: '李四', roomId: 13, roomTitle: '温馨一室一厅B-205', startDate: '2026-03-01', endDate: '2027-02-28', rent: 1800, deposit: 1800, status: 'active', signDate: '2026-02-28', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：李四\n\n第一条 租赁房屋\n甲方将位于郑州市高新区翠竹街88号B栋205号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年3月1日至2027年2月28日，共计1年。\n\n第三条 租金及押金\n月租金为人民币1800元，押金为人民币1800元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 3, orderId: 5, userId: 7, userName: '孙七', roomId: 50, roomTitle: '轻奢一室一厅E-301', startDate: '2026-03-01', endDate: '2027-02-28', rent: 2100, deposit: 2100, status: 'active', signDate: '2026-02-28', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：孙七\n\n第一条 租赁房屋\n甲方将位于郑州市金水区文化路92号E栋301号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年3月1日至2027年2月28日，共计1年。\n\n第三条 租金及押金\n月租金为人民币2100元，押金为人民币2100元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 4, orderId: 6, userId: 8, userName: '周八', roomId: 39, roomTitle: '三室一厅D-301', startDate: '2026-03-15', endDate: '2027-03-14', rent: 3600, deposit: 3600, status: 'active', signDate: '2026-03-14', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：周八\n\n第一条 租赁房屋\n甲方将位于郑州市莲花街166号D栋301号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年3月15日至2027年3月14日，共计1年。\n\n第三条 租金及押金\n月租金为人民币3600元，押金为人民币3600元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 5, orderId: 8, userId: 10, userName: '郑十', roomId: 6, roomTitle: '精品一室一厅A-601', startDate: '2026-04-01', endDate: '2027-03-31', rent: 1900, deposit: 1900, status: 'active', signDate: '2026-03-30', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：郑十\n\n第一条 租赁房屋\n甲方将位于郑州市高新区科学大道100号A栋601号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年4月1日至2027年3月31日，共计1年。\n\n第三条 租金及押金\n月租金为人民币1900元，押金为人民币1900元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 6, orderId: 9, userId: 11, userName: '陈雨', roomId: 7, roomTitle: '温馨一室一厅A-302', startDate: '2026-02-01', endDate: '2027-01-31', rent: 1700, deposit: 1700, status: 'active', signDate: '2026-01-31', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：陈雨\n\n第一条 租赁房屋\n甲方将位于郑州市高新区科学大道100号A栋302号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年2月1日至2027年1月31日，共计1年。\n\n第三条 租金及押金\n月租金为人民币1700元，押金为人民币1700元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 7, orderId: 10, userId: 12, userName: '刘洋', roomId: 12, roomTitle: '两室一厅A-602', startDate: '2026-02-20', endDate: '2027-02-19', rent: 2600, deposit: 2600, status: 'active', signDate: '2026-02-19', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：刘洋\n\n第一条 租赁房屋\n甲方将位于郑州市高新区科学大道100号A栋602号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年2月20日至2027年2月19日，共计1年。\n\n第三条 租金及押金\n月租金为人民币2600元，押金为人民币2600元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 8, orderId: 11, userId: 14, userName: '黄磊', roomId: 30, roomTitle: '一室一厅C-301', startDate: '2026-03-01', endDate: '2027-02-28', rent: 1850, deposit: 1850, status: 'active', signDate: '2026-02-28', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：黄磊\n\n第一条 租赁房屋\n甲方将位于郑州市二七区大学路58号C栋301号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年3月1日至2027年2月28日，共计1年。\n\n第三条 租金及押金\n月租金为人民币1850元，押金为人民币1850元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 9, orderId: 12, userId: 16, userName: '马超', roomId: 18, roomTitle: '一室一厅B-302', startDate: '2026-03-01', endDate: '2027-02-28', rent: 1750, deposit: 1750, status: 'active', signDate: '2026-02-28', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：马超\n\n第一条 租赁房屋\n甲方将位于郑州市高新区翠竹街88号B栋302号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年3月1日至2027年2月28日，共计1年。\n\n第三条 租金及押金\n月租金为人民币1750元，押金为人民币1750元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 10, orderId: 13, userId: 18, userName: '徐明', roomId: 65, roomTitle: 'LOFT一室F-501', startDate: '2026-03-10', endDate: '2027-03-09', rent: 2250, deposit: 2250, status: 'active', signDate: '2026-03-09', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：徐明\n\n第一条 租赁房屋\n甲方将位于郑州市高新区莲花街166号F栋501号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年3月10日至2027年3月9日，共计1年。\n\n第三条 租金及押金\n月租金为人民币2250元，押金为人民币2250元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
  { id: 11, orderId: 14, userId: 20, userName: '罗辉', roomId: 47, roomTitle: '单间D-201', startDate: '2026-03-01', endDate: '2027-02-28', rent: 1050, deposit: 1050, status: 'active', signDate: '2026-02-28', content: '甲方（出租方）：青年公寓运营管理有限公司\n乙方（承租方）：罗辉\n\n第一条 租赁房屋\n甲方将位于郑州市高新区莲花街166号D栋201号房屋出租给乙方使用。\n\n第二条 租赁期限\n租赁期自2026年3月1日至2027年2月28日，共计1年。\n\n第三条 租金及押金\n月租金为人民币1050元，押金为人民币1050元。\n\n第四条 付款方式\n乙方应于每月1日前支付当月租金。\n\n第五条 双方权利义务\n（略）' },
]

// 缴费记录
export const payments = [
  { id: 1, contractId: 1, userId: 3, userName: '张三', roomTitle: '阳光精品单间A-101', type: '租金', amount: 1200, period: '2026年2月', status: 'paid', payTime: '2026-02-14 10:30:00', method: '支付宝' },
  { id: 2, contractId: 1, userId: 3, userName: '张三', roomTitle: '阳光精品单间A-101', type: '押金', amount: 1200, period: '2026年2月', status: 'paid', payTime: '2026-02-14 10:31:00', method: '支付宝' },
  { id: 3, contractId: 1, userId: 3, userName: '张三', roomTitle: '阳光精品单间A-101', type: '租金', amount: 1200, period: '2026年3月', status: 'paid', payTime: '2026-03-01 09:15:00', method: '支付宝' },
  { id: 4, contractId: 1, userId: 3, userName: '张三', roomTitle: '阳光精品单间A-101', type: '租金', amount: 1200, period: '2026年4月', status: 'unpaid', payTime: null, method: '' },
  { id: 5, contractId: 1, userId: 3, userName: '张三', roomTitle: '阳光精品单间A-101', type: '水费', amount: 45, period: '2026年3月', status: 'unpaid', payTime: null, method: '' },
  { id: 6, contractId: 1, userId: 3, userName: '张三', roomTitle: '阳光精品单间A-101', type: '电费', amount: 120, period: '2026年3月', status: 'unpaid', payTime: null, method: '' },
  { id: 7, contractId: 2, userId: 4, userName: '李四', roomTitle: '温馨一室一厅B-205', type: '租金', amount: 1800, period: '2026年3月', status: 'paid', payTime: '2026-03-01 14:20:00', method: '微信支付' },
  { id: 8, contractId: 2, userId: 4, userName: '李四', roomTitle: '温馨一室一厅B-205', type: '押金', amount: 1800, period: '2026年3月', status: 'paid', payTime: '2026-02-28 16:00:00', method: '微信支付' },
  { id: 9, contractId: 2, userId: 4, userName: '李四', roomTitle: '温馨一室一厅B-205', type: '租金', amount: 1800, period: '2026年4月', status: 'unpaid', payTime: null, method: '' },
  { id: 10, contractId: 2, userId: 4, userName: '李四', roomTitle: '温馨一室一厅B-205', type: '水费', amount: 38, period: '2026年3月', status: 'unpaid', payTime: null, method: '' },
  { id: 11, contractId: 3, userId: 7, userName: '孙七', roomTitle: '轻奢一室一厅E-301', type: '租金', amount: 2100, period: '2026年3月', status: 'paid', payTime: '2026-03-01 08:30:00', method: '支付宝' },
  { id: 12, contractId: 3, userId: 7, userName: '孙七', roomTitle: '轻奢一室一厅E-301', type: '押金', amount: 2100, period: '2026年3月', status: 'paid', payTime: '2026-02-28 09:00:00', method: '支付宝' },
  { id: 13, contractId: 3, userId: 7, userName: '孙七', roomTitle: '轻奢一室一厅E-301', type: '租金', amount: 2100, period: '2026年4月', status: 'unpaid', payTime: null, method: '' },
  { id: 14, contractId: 4, userId: 8, userName: '周八', roomTitle: '三室一厅D-301', type: '租金', amount: 3600, period: '2026年3月', status: 'paid', payTime: '2026-03-15 10:00:00', method: '银行转账' },
  { id: 15, contractId: 4, userId: 8, userName: '周八', roomTitle: '三室一厅D-301', type: '押金', amount: 3600, period: '2026年3月', status: 'paid', payTime: '2026-03-14 11:00:00', method: '银行转账' },
  { id: 16, contractId: 5, userId: 10, userName: '郑十', roomTitle: '精品一室一厅A-601', type: '租金', amount: 1900, period: '2026年4月', status: 'unpaid', payTime: null, method: '' },
  { id: 17, contractId: 5, userId: 10, userName: '郑十', roomTitle: '精品一室一厅A-601', type: '押金', amount: 1900, period: '2026年4月', status: 'unpaid', payTime: null, method: '' },
  { id: 18, contractId: 6, userId: 11, userName: '陈雨', roomTitle: '温馨一室一厅A-302', type: '租金', amount: 1700, period: '2026年2月', status: 'paid', payTime: '2026-02-01 09:00:00', method: '微信支付' },
  { id: 19, contractId: 6, userId: 11, userName: '陈雨', roomTitle: '温馨一室一厅A-302', type: '押金', amount: 1700, period: '2026年2月', status: 'paid', payTime: '2026-01-31 15:00:00', method: '微信支付' },
  { id: 20, contractId: 6, userId: 11, userName: '陈雨', roomTitle: '温馨一室一厅A-302', type: '租金', amount: 1700, period: '2026年3月', status: 'paid', payTime: '2026-03-01 08:45:00', method: '微信支付' },
  { id: 21, contractId: 6, userId: 11, userName: '陈雨', roomTitle: '温馨一室一厅A-302', type: '租金', amount: 1700, period: '2026年4月', status: 'unpaid', payTime: null, method: '' },
  { id: 22, contractId: 7, userId: 12, userName: '刘洋', roomTitle: '两室一厅A-602', type: '租金', amount: 2600, period: '2026年3月', status: 'paid', payTime: '2026-03-01 10:00:00', method: '支付宝' },
  { id: 23, contractId: 7, userId: 12, userName: '刘洋', roomTitle: '两室一厅A-602', type: '押金', amount: 2600, period: '2026年2月', status: 'paid', payTime: '2026-02-19 16:30:00', method: '支付宝' },
  { id: 24, contractId: 7, userId: 12, userName: '刘洋', roomTitle: '两室一厅A-602', type: '水费', amount: 55, period: '2026年3月', status: 'paid', payTime: '2026-03-25 14:00:00', method: '支付宝' },
  { id: 25, contractId: 8, userId: 14, userName: '黄磊', roomTitle: '一室一厅C-301', type: '租金', amount: 1850, period: '2026年3月', status: 'paid', payTime: '2026-03-01 11:20:00', method: '微信支付' },
  { id: 26, contractId: 8, userId: 14, userName: '黄磊', roomTitle: '一室一厅C-301', type: '押金', amount: 1850, period: '2026年3月', status: 'paid', payTime: '2026-02-28 13:00:00', method: '微信支付' },
  { id: 27, contractId: 9, userId: 16, userName: '马超', roomTitle: '一室一厅B-302', type: '租金', amount: 1750, period: '2026年3月', status: 'paid', payTime: '2026-03-01 09:30:00', method: '支付宝' },
  { id: 28, contractId: 9, userId: 16, userName: '马超', roomTitle: '一室一厅B-302', type: '押金', amount: 1750, period: '2026年3月', status: 'paid', payTime: '2026-02-28 10:00:00', method: '支付宝' },
  { id: 29, contractId: 10, userId: 18, userName: '徐明', roomTitle: 'LOFT一室F-501', type: '租金', amount: 2250, period: '2026年3月', status: 'paid', payTime: '2026-03-10 08:00:00', method: '银行转账' },
  { id: 30, contractId: 10, userId: 18, userName: '徐明', roomTitle: 'LOFT一室F-501', type: '押金', amount: 2250, period: '2026年3月', status: 'paid', payTime: '2026-03-09 09:30:00', method: '银行转账' },
  { id: 31, contractId: 10, userId: 18, userName: '徐明', roomTitle: 'LOFT一室F-501', type: '电费', amount: 165, period: '2026年3月', status: 'unpaid', payTime: null, method: '' },
  { id: 32, contractId: 11, userId: 20, userName: '罗辉', roomTitle: '单间D-201', type: '租金', amount: 1050, period: '2026年3月', status: 'paid', payTime: '2026-03-01 12:00:00', method: '微信支付' },
  { id: 33, contractId: 11, userId: 20, userName: '罗辉', roomTitle: '单间D-201', type: '押金', amount: 1050, period: '2026年3月', status: 'paid', payTime: '2026-02-28 14:30:00', method: '微信支付' },
  { id: 34, contractId: 11, userId: 20, userName: '罗辉', roomTitle: '单间D-201', type: '水费', amount: 22, period: '2026年3月', status: 'paid', payTime: '2026-03-20 10:00:00', method: '微信支付' },
]

// 公告列表
export const announcements = [
  { id: 1, title: '关于2026年春节期间物业服务安排的通知', content: '各位租户：春节期间（1月28日-2月4日），物业服务热线正常开通，紧急维修可拨打24小时值班电话。', createTime: '2026-01-20' },
  { id: 2, title: '公寓公共区域WiFi升级公告', content: '为提升租户上网体验，公寓将于2月15日对公共区域WiFi进行升级，届时可能会有短暂中断。', createTime: '2026-02-10' },
  { id: 3, title: '3月消防安全演练通知', content: '根据消防部门要求，公寓将于3月20日下午14:00进行消防安全演练，请各位租户积极参与。', createTime: '2026-03-10' },
  { id: 4, title: 'F栋新楼正式开放入住公告', content: 'F栋装修全面完工，即日起开放预约看房，首批入住可享首月租金8折优惠。', createTime: '2026-03-15' },
  { id: 5, title: '关于调整水电费计费方式的通知', content: '自2026年4月1日起，水电费将采用阶梯计费方式，具体标准详见公告栏。', createTime: '2026-03-22' },
]

// 模拟API方法
export function getRoomById(id) {
  return rooms.find(r => r.id === Number(id))
}

export function getRoomsByStatus(status) {
  return rooms.filter(r => r.status === status)
}

export function getUserById(id) {
  return users.find(u => u.id === Number(id))
}

export function getOrdersByUserId(userId) {
  return orders.filter(o => o.userId === Number(userId))
}

export function getContractsByUserId(userId) {
  return contracts.filter(c => c.userId === Number(userId))
}

export function getPaymentsByUserId(userId) {
  return payments.filter(p => p.userId === Number(userId))
}

// 统计数据
export const stats = {
  totalRooms: rooms.length,
  availableRooms: rooms.filter(r => r.status === 'available').length,
  rentedRooms: rooms.filter(r => r.status === 'rented').length,
  reservedRooms: rooms.filter(r => r.status === 'reserved').length,
  totalUsers: users.length,
  totalTenants: users.filter(u => u.role === 'tenant').length,
  totalOrders: orders.length,
  activeOrders: orders.filter(o => o.status === 'active').length,
  totalRevenue: payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0),
  totalPayments: payments.length,
  paidPayments: payments.filter(p => p.status === 'paid').length,
  unpaidPayments: payments.filter(p => p.status === 'unpaid').length,
}
