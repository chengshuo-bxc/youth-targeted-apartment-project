import request from '@/utils/request'

// 登录
export function login(data) {
  return request.post('/auth/login', data)
}

// 注册
export function register(data) {
  return request.post('/auth/register', data)
}

// 获取当前用户信息
export function getUserInfo() {
  return request.get('/users/info')
}

// 获取用户列表（管理员）
export function getUserList() {
  return request.get('/users')
}

// 更新用户状态
export function updateUserStatus(id, status) {
  return request.put(`/users/${id}/status`, { status })
}

// ========== 房源 ==========

// 前台房源列表
export function getFrontRooms(params) {
  return request.get('/rooms/front', { params })
}

// 房源详情
export function getRoomDetail(id) {
  return request.get(`/rooms/${id}`)
}

// 管理端房源列表
export function getRoomList(params) {
  return request.get('/rooms', { params })
}

// 新增房源
export function addRoom(data) {
  return request.post('/rooms', data)
}

// 编辑房源
export function updateRoom(id, data) {
  return request.put(`/rooms/${id}`, data)
}

// 变更房源状态
export function changeRoomStatus(id, status) {
  return request.put(`/rooms/${id}/status`, { status })
}

// 删除房源
export function deleteRoom(id) {
  return request.delete(`/rooms/${id}`)
}

// ========== 订单 ==========

// 管理端订单列表
export function getOrderList(params) {
  return request.get('/orders', { params })
}

// 我的订单
export function getMyOrders(params) {
  return request.get('/orders/mine', { params })
}

// 创建订单
export function createOrder(data) {
  return request.post('/orders', data)
}

// 审批订单
export function approveOrder(id) {
  return request.put(`/orders/${id}/approve`)
}

// 驳回订单
export function rejectOrder(id) {
  return request.put(`/orders/${id}/reject`)
}

// 更新订单状态
export function updateOrderStatus(id, status) {
  return request.put(`/orders/${id}/status`, { status })
}

// 管理员：转交订单给管家
export function assignOrder(id, managerId) {
  return request.put(`/orders/${id}/assign`, { manager_id: managerId })
}

// 获取管家列表
export function getManagerList() {
  return request.get('/users/managers')
}

// 管理员：更新用户信息
export function updateUser(id, data) {
  return request.put(`/users/${id}`, data)
}

// ========== 合同 ==========

export function getContractList() {
  return request.get('/contracts')
}

export function getMyContracts() {
  return request.get('/contracts/mine')
}

// ========== 缴费 ==========

export function getPaymentList() {
  return request.get('/payments')
}

export function getMyPayments() {
  return request.get('/payments/mine')
}

export function payPayment(id, method) {
  return request.put(`/payments/${id}/pay`, { method })
}

// ========== 公告 ==========

export function getAnnouncements() {
  return request.get('/announcements')
}

// ========== 统计 ==========

// 前台公开统计
export function getPublicStats() {
  return request.get('/stats/public')
}

// 前台详细统计（数据分析页面）
export function getAnalysisStats() {
  return request.get('/stats/analysis')
}

// 管理端统计
export function getStats() {
  return request.get('/stats')
}
