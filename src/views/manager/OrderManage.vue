<template>
  <div class="order-manage">
    <h2 class="section-title">
      订单审核
      <el-tag size="small" type="warning">负责区域：{{ userStore.userInfo?.area || '未分配' }}</el-tag>
      <el-tag v-if="lastUpdate" size="small" type="info" effect="plain">最后更新：{{ lastUpdate }}</el-tag>
    </h2>
    <el-card shadow="never">
      <div class="auto-refresh-bar">
        <span class="refresh-hint">
          <el-icon class="rotating" v-if="loading"><Loading /></el-icon>
          <el-icon v-else color="#67C23A"><SuccessFilled /></el-icon>
          实时监控中 · 每{{ interval / 1000 }}秒自动刷新
        </span>
        <el-switch v-model="autoRefresh" active-text="自动刷新" inactive-text="" />
        <el-button :icon="Refresh" size="small" circle @click="loadOrders" :loading="loading" />
      </div>

      <el-tabs v-model="activeTab" class="order-tabs">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待审核" name="pending">
          <template #label>
            待审核 <el-badge v-if="pendingCount > 0" :value="pendingCount" :max="99" />
          </template>
        </el-tab-pane>
        <el-tab-pane label="已通过" name="active"></el-tab-pane>
        <el-tab-pane label="已完成" name="completed"></el-tab-pane>
        <el-tab-pane label="已取消" name="cancelled"></el-tab-pane>
      </el-tabs>
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索租客/房源" clearable style="width:220px;" :prefix-icon="Search" />
      </div>

      <el-table :data="filteredOrders" stripe border v-loading="loading">
        <el-table-column prop="id" label="订单号" width="80" />
        <el-table-column prop="userName" label="租客" width="80" />
        <el-table-column prop="roomTitle" label="房源" min-width="160" />
        <el-table-column prop="type" label="类型" width="80"><template #default="{ row }">
          <el-tag size="small">{{ row.type }}</el-tag></template></el-table-column>
        <el-table-column prop="checkIn" label="入住日期" width="110" />
        <el-table-column prop="status" label="状态" width="90"><template #default="{ row }">
          <el-tag size="small" :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag></template></el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
        <el-table-column prop="createTime" label="申请时间" width="110" />
        <el-table-column label="操作" width="180" fixed="right"><template #default="{ row }">
          <el-button v-if="row.status==='pending'" size="small" type="success" @click="handleApprove(row)">通过</el-button>
          <el-button v-if="row.status==='pending'" size="small" type="danger" @click="handleReject(row)">驳回</el-button>
          <el-tag v-if="row.status!=='pending'" size="small">{{ statusLabel(row.status) }}</el-tag>
        </template></el-table-column>
      </el-table>
    </el-card>

    <!-- 新订单提示 -->
    <transition name="el-fade-in">
      <div v-if="newOrderAlert" class="new-order-alert" @click="showNewOrders">
        <el-icon color="#fff" :size="22"><Bell /></el-icon>
        <span>有 {{ newOrderCount }} 条新订单待审核！点击查看</span>
        <el-button size="small" type="primary" text style="color:#fff;" @click.stop="newOrderAlert=false">
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </transition>

    <el-alert title="管家权限说明" type="info" :closable="false" show-icon style="margin-top:16px;">
      您只能审核<strong>您所管理区域（{{ userStore.userInfo?.area || '未分配' }}）</strong>的房源产生的订单。
    </el-alert>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getOrderList, approveOrder, rejectOrder } from '@/api'
import { ElMessage } from 'element-plus'
import { Search, Refresh, Loading, SuccessFilled, Bell, Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const loading = ref(false)
const keyword = ref('')
const activeTab = ref('all')
const orderList = ref([])
const autoRefresh = ref(true)
const lastUpdate = ref('')
const newOrderAlert = ref(false)
const newOrderCount = ref(0)
let prevPendingCount = 0
let timer = null
const interval = 8000 // 每8秒刷新

async function loadOrders() {
  loading.value = true
  try {
    const { data } = await getOrderList()
    orderList.value = data.map(o => ({
      ...o,
      id: o.order_id ?? o.id,
      userName: o.user_name ?? o.userName,
      roomTitle: o.room_title ?? o.roomTitle,
      checkIn: (o.check_in || '').slice(0,10),
      createTime: (o.create_time || '').slice(0,10),
    }))
    // 检测新订单
    const curPending = pendingCount.value
    if (prevPendingCount > 0 && curPending > prevPendingCount) {
      newOrderCount.value = curPending - prevPendingCount
      newOrderAlert.value = true
    }
    prevPendingCount = curPending
    lastUpdate.value = new Date().toLocaleTimeString()
  } catch (e) { console.error(e) }
  loading.value = false
}

const filteredOrders = computed(() => {
  let list = orderList.value
  if (activeTab !== 'all') list = list.filter(o => o.status === activeTab)
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(o => (o.userName||'').includes(kw) || (o.roomTitle||'').toLowerCase().includes(kw))
  }
  return list
})

const pendingCount = computed(() => orderList.value.filter(o => o.status === 'pending').length)

function statusType(s) { return { pending:'warning', active:'success', completed:'', cancelled:'info' }[s] || 'info' }
function statusLabel(s) { return { pending:'待审核', active:'已通过', completed:'已完成', cancelled:'已取消' }[s] || s }

async function handleApprove(row) {
  try { await approveOrder(row.id); row.status='active'; ElMessage.success('订单已通过，系统已自动生成电子合同和缴费记录'); loadOrders() } catch(e){console.error(e)}
}
async function handleReject(row) {
  try { await rejectOrder(row.id); row.status='cancelled'; ElMessage.success('订单已驳回，房源已释放'); loadOrders() } catch(e){console.error(e)}
}

function showNewOrders() {
  newOrderAlert.value = false
  activeTab.value = 'pending'
}

onMounted(() => {
  loadOrders()
  timer = setInterval(() => { if (autoRefresh.value) loadOrders() }, interval)
})
onUnmounted(() => { if (timer) clearInterval(timer) })
</script>

<style scoped>
.order-tabs{margin-bottom:16px}.toolbar{display:flex;gap:12px;margin-bottom:16px}
.auto-refresh-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 8px 14px;
  background: #f0f9eb;
  border-radius: 6px;
  border: 1px solid #e1f3d8;
}
.refresh-hint { font-size:13px; color:#67C23A;display:flex;align-items:center;gap:6px; }
.rotating { animation: rotate 1s linear infinite; }
@keyframes rotate { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

.new-order-alert {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 3000;
  background: linear-gradient(135deg, #F56C6C, #E6A23C);
  color: #fff;
  padding: 14px 20px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(245,108,108,.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  animation: slideInRight .4s ease;
  transition: transform .2s;
}
.new-order-alert:hover { transform: scale(1.03); }
@keyframes slideInRight {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
</style>
