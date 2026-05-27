<template>
  <div class="front-layout">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-inner">
        <div class="logo" @click="$router.push('/')">
          <div class="logo-icon">
            <el-icon :size="22" color="#fff"><OfficeBuilding /></el-icon>
          </div>
          <span class="logo-text">青年公寓</span>
        </div>
        <div class="nav-links">
          <router-link to="/" exact-active-class="nav-active" class="nav-link">
            <el-icon><HomeFilled /></el-icon> 首页
          </router-link>
          <router-link to="/rooms" exact-active-class="nav-active" class="nav-link">
            <el-icon><House /></el-icon> 房源列表
          </router-link>
          <router-link to="/analysis" exact-active-class="nav-active" class="nav-link">
            <el-icon><DataAnalysis /></el-icon> 数据分析
          </router-link>
          <router-link to="/announcements" exact-active-class="nav-active" class="nav-link">
            <el-icon><Bell /></el-icon> 公告中心
          </router-link>
          <router-link to="/contact" exact-active-class="nav-active" class="nav-link">
            <el-icon><Phone /></el-icon> 联系我们
          </router-link>
        </div>
        <div class="header-right">
          <template v-if="userStore.isLoggedIn">
            <el-dropdown @command="handleCommand">
              <div class="user-info">
                <el-avatar :size="34" :icon="UserFilled" class="user-avatar" />
                <span class="username">{{ userStore.userName }}</span>
                <el-icon class="arrow-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon> 个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="orders">
                    <el-icon><Document /></el-icon> 我的订单
                  </el-dropdown-item>
                  <el-dropdown-item command="contracts">
                    <el-icon><Tickets /></el-icon> 我的合同
                  </el-dropdown-item>
                  <el-dropdown-item command="payments">
                    <el-icon><Wallet /></el-icon> 缴费记录
                  </el-dropdown-item>
                  <el-dropdown-item v-if="userStore.isAdmin" command="admin" divided>
                    <el-icon><Setting /></el-icon> 后台管理
                  </el-dropdown-item>
                  <el-dropdown-item v-if="userStore.isManager" command="manager" divided>
                    <el-icon><OfficeBuilding /></el-icon> 管家工作台
                  </el-dropdown-item>
                  <el-dropdown-item command="logout" divided>
                    <el-icon><SwitchButton /></el-icon> 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <el-button round @click="$router.push('/login')">登录</el-button>
            <el-button type="primary" round @click="$router.push('/register')">免费注册</el-button>
          </template>
        </div>
      </div>
    </el-header>

    <!-- 主内容区 -->
    <el-main class="main-content">
      <router-view />
    </el-main>

    <!-- 底部 -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-grid">
          <div class="footer-col">
            <div class="footer-logo">
              <div class="footer-logo-icon">
                <el-icon :size="20" color="#fff"><OfficeBuilding /></el-icon>
              </div>
              <span>青年公寓服务系统</span>
            </div>
            <p class="footer-desc">为都市青年打造温暖、便捷、安全的居住空间。实名认证、在线签约、便捷缴费，一站式公寓服务。</p>
          </div>
          <div class="footer-col">
            <h4>快速导航</h4>
            <router-link to="/" class="footer-link">首页</router-link>
            <router-link to="/rooms" class="footer-link">房源列表</router-link>
            <router-link to="/login" class="footer-link">登录 / 注册</router-link>
          </div>
          <div class="footer-col">
            <h4>用户服务</h4>
            <router-link to="/user/orders" class="footer-link">我的订单</router-link>
            <router-link to="/user/contracts" class="footer-link">我的合同</router-link>
            <router-link to="/user/payments" class="footer-link">缴费记录</router-link>
          </div>
          <div class="footer-col">
            <h4>联系我们</h4>
            <p class="footer-contact"><el-icon><Location /></el-icon> 郑州市高新区科学大道100号</p>
            <p class="footer-contact"><el-icon><Phone /></el-icon> 400-888-9999</p>
            <p class="footer-contact"><el-icon><Message /></el-icon> service@youthapt.com</p>
          </div>
        </div>
        <el-divider class="footer-divider" />
        <div class="footer-bottom">
          <p>青年公寓服务系统 &copy; 2026 | 郑州商学院 计算机与大数据工程学院</p>
          <p>基于 Node.js + Vue3 + MySQL 的前后端分离架构</p>
        </div>
      </div>
    </footer>

    <!-- 缴费提醒弹窗 -->
    <el-dialog
      v-model="paymentDialogVisible"
      title="缴费提醒"
      width="520px"
      top="20vh"
      :close-on-click-modal="false"
    >
      <div class="payment-reminder">
        <div class="reminder-icon">
          <el-icon :size="48" color="#E6A23C"><Warning /></el-icon>
        </div>
        <div class="reminder-title">您有未缴费账单</div>
        <div class="reminder-count">共 <span class="highlight">{{ unpaidPayments.length }}</span> 条待缴费记录</div>
        
        <div class="payment-list">
          <div v-for="payment in unpaidPayments" :key="payment.id" class="payment-item">
            <div class="payment-info">
              <span class="payment-type">{{ payment.type }}</span>
              <span class="payment-date">{{ payment.due_date }}</span>
            </div>
            <div class="payment-amount">¥{{ payment.amount }}</div>
          </div>
        </div>
        
        <div class="reminder-total">
          合计金额：<span class="total-amount">¥{{ totalUnpaidAmount }}</span>
        </div>
      </div>
      
      <template #footer>
        <el-button @click="paymentDialogVisible = false">稍后再说</el-button>
        <el-button type="primary" @click="goToPayments">立即缴费</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getMyPayments } from '@/api'
import {
  UserFilled, ArrowDown, OfficeBuilding,
  HomeFilled, House, Bell, Phone, User,
  Document, Tickets, Wallet, Setting, SwitchButton,
  Location, Message, DataAnalysis, Warning
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

const paymentDialogVisible = ref(false)
const unpaidPayments = ref([])

const totalUnpaidAmount = computed(() => {
  return unpaidPayments.value.reduce((sum, p) => sum + Number(p.amount), 0)
})

// 监听登录状态，登录后检查未缴费记录
watch(() => userStore.isLoggedIn, async (isLoggedIn) => {
  if (isLoggedIn && !userStore.isAdmin) {
    await checkUnpaidPayments()
  }
}, { immediate: true })

async function checkUnpaidPayments() {
  try {
    const res = await getMyPayments()
    if (res.code === 200) {
      const unpaid = res.data.filter(p => p.status === 'unpaid')
      if (unpaid.length > 0) {
        unpaidPayments.value = unpaid.map(p => ({
          ...p,
          id: p.payment_id
        }))
        paymentDialogVisible.value = true
      }
    }
  } catch (e) {
    console.error('获取缴费记录失败:', e)
  }
}

function handleCommand(cmd) {
  const map = {
    profile: '/user/profile',
    orders: '/user/orders',
    contracts: '/user/contracts',
    payments: '/user/payments',
    admin: '/admin/dashboard',
    manager: '/manager/dashboard',
    logout: null
  }
  if (cmd === 'logout') {
    userStore.logout()
    router.push('/')
    return
  }
  if (map[cmd]) router.push(map[cmd])
}

function goToPayments() {
  paymentDialogVisible.value = false
  router.push('/user/payments')
}
</script>

<style scoped>
.front-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

/* ===== Header ===== */
.header {
  background: #fff;
  padding: 0;
  height: 68px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 12px rgba(0, 0, 0, 0.06);
}

.header-inner {
  max-width: 1800px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 24px;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 48px;
  flex-shrink: 0;
  gap: 10px;
}

.logo-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #409EFF, #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.35);
}

.logo-text {
  font-size: 22px;
  font-weight: 800;
  color: #303133;
  letter-spacing: 1px;
}

/* ===== Nav ===== */
.nav-links {
  flex: 1;
  display: flex;
  gap: 2px;
}

.nav-link {
  font-size: 16px;
  color: #606266;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.25s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.nav-link:hover {
  color: #409EFF;
  background: #ecf5ff;
}

.nav-active {
  color: #409EFF;
  font-weight: 600;
  background: #ecf5ff;
}

/* ===== User ===== */
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: 24px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f7fa;
}

.user-avatar {
  border: 2px solid #409EFF;
}

.username {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.arrow-icon {
  font-size: 12px;
  color: #909399;
}

/* ===== Main ===== */
.main-content {
  flex: 1;
  padding: 0 !important;
  background: #f5f7fa;
}

/* ===== Footer ===== */
.footer {
  background: #1a1f36;
  color: #c0c4cc;
  padding: 0;
  margin-top: auto;
}

.footer-inner {
  max-width: 1800px;
  margin: 0 auto;
  padding: 48px 24px 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 40px;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-logo {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.footer-logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: linear-gradient(135deg, #409EFF, #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-desc {
  font-size: 13px;
  color: #8b8fa3;
  line-height: 1.8;
  margin: 0;
}

.footer-col h4 {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 16px;
}

.footer-link {
  display: block;
  font-size: 13px;
  color: #8b8fa3;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #409EFF;
}

.footer-contact {
  font-size: 13px;
  color: #8b8fa3;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.footer-divider {
  border-color: #2a2f4a;
  margin: 32px 0 20px;
}

.footer-bottom {
  text-align: center;
}

.footer-bottom p {
  margin: 4px 0;
  font-size: 12px;
  color: #6b7280;
}

/* ===== Payment Reminder Dialog ===== */
.payment-reminder {
  text-align: center;
  padding: 20px 0;
}

.reminder-icon {
  margin-bottom: 16px;
}

.reminder-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.reminder-count {
  font-size: 14px;
  color: #909399;
  margin-bottom: 24px;
}

.reminder-count .highlight {
  color: #E6A23C;
  font-weight: 600;
  font-size: 18px;
}

.payment-list {
  max-height: 200px;
  overflow-y: auto;
  text-align: left;
  background: #f5f7fa;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.payment-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e4e7ed;
}

.payment-item:last-child {
  border-bottom: none;
}

.payment-type {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.payment-date {
  font-size: 12px;
  color: #909399;
  margin-left: 12px;
}

.payment-amount {
  font-size: 16px;
  font-weight: 600;
  color: #F56C6C;
}

.reminder-total {
  font-size: 14px;
  color: #606266;
}

.total-amount {
  font-size: 22px;
  font-weight: 700;
  color: #F56C6C;
}
</style>