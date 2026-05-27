<template>
  <div class="manager-dashboard">
    <h2>管家工作概览</h2>
    <div class="area-banner">
      <el-icon :size="20" color="#E6A23C"><Location /></el-icon>
      <span>负责区域：<strong>{{ userStore.userInfo?.area || '未分配' }}</strong></span>
      <el-tag size="small" type="success" effect="plain" style="margin-left:8px;">
        {{ autoRefresh ? '实时更新中' : '已暂停' }}
      </el-tag>
      <el-tag size="small" type="info" effect="plain">每{{ interval/1000 }}秒刷新</el-tag>
      <el-switch v-model="autoRefresh" size="small" />
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" style="margin-bottom:20px;">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card stat-blue">
            <el-icon :size="40"><House /></el-icon>
            <div>
              <div class="stat-num">{{ stats.totalRooms }}</div>
              <div class="stat-label">管理房源</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card stat-green">
            <el-icon :size="40"><CircleCheck /></el-icon>
            <div>
              <div class="stat-num">{{ stats.availableRooms }}</div>
              <div class="stat-label">可租房源</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card stat-orange">
            <el-icon :size="40"><List /></el-icon>
            <div>
              <div class="stat-num">{{ stats.pendingOrders }}</div>
              <div class="stat-label">待审核订单</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card stat-red">
            <el-icon :size="40"><User /></el-icon>
            <div>
              <div class="stat-num">{{ stats.activeTenants }}</div>
              <div class="stat-label">在租客户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近订单 -->
    <el-card shadow="never">
      <template #header>
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>最近待审核订单</strong>
          <span style="font-size:12px;color:#909399;" v-if="lastUpdate">最后更新：{{ lastUpdate }}</span>
        </div>
      </template>
      <el-table :data="recentOrders" v-loading="loading" stripe size="small">
        <el-table-column prop="order_id" label="ID" width="60" />
        <el-table-column prop="user_name" label="租客" width="100" />
        <el-table-column prop="room_title" label="房源" min-width="150" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'info'" size="small">
              {{ statusText[row.status] || row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="申请时间" width="170" />
        <el-table-column label="操作" width="160">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="handleApprove(row.order_id)">通过</el-button>
            <el-button type="danger" size="small" @click="handleReject(row.order_id)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新订单弹窗提示 -->
    <transition name="el-fade-in">
      <div v-if="showNewOrderTip" class="new-order-tip" @click="handleNewOrderClick">
        <el-icon color="#fff" :size="22"><Bell /></el-icon>
        <span>有 {{ newOrderCount }} 条新订单待审核！点击查看</span>
        <el-button size="small" text style="color:#fff;" @click.stop="showNewOrderTip=false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </transition>

    <!-- 提示信息 -->
    <el-alert
      title="数据隔离说明"
      type="info"
      :closable="false"
      show-icon
      style="margin-top:20px"
    >
      作为管家，您只能查看和操作<strong>您所管理区域（{{ userStore.userInfo?.area || '未分配' }}）</strong>的房源与订单，无法跨区域查看其他管家的数据。所有数据每8秒自动同步。
    </el-alert>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import { House, List, User, CircleCheck, Location, Bell, Close } from '@element-plus/icons-vue'
import { getRoomList, getOrderList, approveOrder, rejectOrder } from '@/api'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const loading = ref(false)
const recentOrders = ref([])
const lastUpdate = ref('')
const autoRefresh = ref(true)
const showNewOrderTip = ref(false)
const newOrderCount = ref(0)
let prevPendingCount = 0
let timer = null
const interval = 8000

const stats = reactive({ totalRooms: 0, availableRooms: 0, pendingOrders: 0, activeTenants: 0 })
const statusText = { pending: '待审核', active: '已通过', completed: '已完成', cancelled: '已取消', reserved: '已预订' }

async function loadData() {
  loading.value = true
  try {
    const [roomsRes, ordersRes] = await Promise.all([getRoomList(), getOrderList()])
    const rooms = roomsRes.data || []
    const orders = ordersRes.data || []
    
    stats.totalRooms = rooms.length
    stats.availableRooms = rooms.filter(r => r.status === 'available').length
    stats.pendingOrders = orders.filter(o => o.status === 'pending').length
    stats.activeTenants = [...new Set(orders.filter(o => o.status === 'active').map(o => o.user_id))].length
    
    const curPending = stats.pendingOrders
    if (prevPendingCount > 0 && curPending > prevPendingCount) {
      newOrderCount.value = curPending - prevPendingCount
      showNewOrderTip.value = true
    }
    prevPendingCount = curPending
    
    recentOrders.value = orders.filter(o => o.status === 'pending').slice(0, 5)
    lastUpdate.value = new Date().toLocaleTimeString()
  } catch (e) { console.error(e) }
  loading.value = false
}

async function handleApprove(id) {
  await approveOrder(id); ElMessage.success('已通过'); loadData()
}
async function handleReject(id) {
  await rejectOrder(id); ElMessage.success('已驳回'); loadData()
}
function handleNewOrderClick() {
  showNewOrderTip.value = false
}

onMounted(() => {
  loadData()
  timer = setInterval(() => { if (autoRefresh.value) loadData() }, interval)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-num {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}
.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 4px;
}

.area-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #FDF6EC;
  border: 1px solid #FAECD8;
  border-radius: 8px;
  padding: 12px 18px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #606266;
}

.new-order-tip {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 3000;
  background: linear-gradient(135deg, #F56C6C, #E6A23C);
  color: #fff;
  padding: 14px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(245,108,108,0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  animation: slideInRight 0.4s ease;
}
.new-order-tip:hover {
  transform: scale(1.03);
}
@keyframes slideInRight {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>
