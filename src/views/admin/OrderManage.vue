<template>
  <div class="order-manage">
    <h2 class="section-title">订单管理</h2>
    <el-card shadow="never">
      <el-tabs v-model="activeTab" class="order-tabs">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待确认" name="pending"></el-tab-pane>
        <el-tab-pane label="进行中" name="active"></el-tab-pane>
        <el-tab-pane label="已完成" name="completed"></el-tab-pane>
        <el-tab-pane label="已取消" name="cancelled"></el-tab-pane>
      </el-tabs>
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索租客/房源" clearable style="width: 220px;" :prefix-icon="Search" />
      </div>

      <el-table :data="filteredOrders" stripe border>
        <el-table-column prop="id" label="订单号" width="80" />
        <el-table-column prop="userName" label="租客" width="80" />
        <el-table-column prop="roomTitle" label="房源" min-width="160" />
        <el-table-column prop="managerArea" label="负责区域" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.managerArea" size="small" type="warning">{{ row.managerArea }}</el-tag>
            <span v-else style="color:#c0c4cc;">未分配</span>
          </template>
        </el-table-column>
        <el-table-column prop="managerName" label="负责管家" width="90">
          <template #default="{ row }">
            {{ row.managerName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="row.type === '预订' ? '' : 'warning'">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checkIn" label="入住日期" width="110" />
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="120" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="110" />
        <el-table-column label="操作" width="260" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" size="small" type="success" @click="handleApprove(row)">通过</el-button>
            <el-button v-if="row.status === 'pending'" size="small" type="danger" @click="handleReject(row)">驳回</el-button>
            <el-button v-if="row.status === 'active'" size="small" type="warning" @click="handleComplete(row)">完成</el-button>
            <el-button size="small" type="primary" plain @click="handleAssign(row)">转交管家</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 转交管家对话框 -->
    <el-dialog v-model="assignDialogVisible" title="转交订单给管家" width="450px">
      <p style="margin-bottom:12px;color:#606266;">
        订单 <strong>#{{ assigningOrder?.id }}</strong> - {{ assigningOrder?.roomTitle }} → 选择负责管家：
      </p>
      <el-select v-model="selectedManager" placeholder="请选择管家" style="width:100%;" :loading="managersLoading" :disabled="managers.length === 0 && !managersLoading">
        <el-option v-for="m in managers" :key="m.user_id" :label="`${m.name} (${m.area || '未分配区域'})`" :value="m.user_id" />
      </el-select>
      <div v-if="managersError" style="color:#f56c6c;margin-top:8px;font-size:13px;">
        加载失败: {{ managersError }}
      </div>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!selectedManager" @click="confirmAssign">确认转交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getOrderList, approveOrder, rejectOrder, updateOrderStatus, assignOrder, getManagerList } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const keyword = ref('')
const activeTab = ref('all')
const orderList = ref([])
// 转交相关
const assignDialogVisible = ref(false)
const assigningOrder = ref(null)
const selectedManager = ref(null)
const managers = ref([])
const managersLoading = ref(false)
const managersError = ref('')

async function loadOrders() {
  try {
    const { data } = await getOrderList()
    orderList.value = data.map(o => ({
      ...o,
      id: o.order_id ?? o.id,
      userName: o.user_name ?? o.userName,
      roomTitle: o.room_title ?? o.roomTitle,
      checkIn: o.check_in ? o.check_in.slice(0, 10) : (o.checkIn || ''),
      checkOut: o.check_out ? o.check_out.slice(0, 10) : (o.checkOut || ''),
      createTime: o.create_time ? o.create_time.slice(0, 10) : (o.createTime || ''),
      managerName: o.manager_name || '',
      managerArea: o.manager_area || '',
    }))
  } catch (e) {
    console.error('获取订单列表失败', e)
  }
}

const filteredOrders = computed(() => {
  let list = orderList.value
  if (activeTab.value !== 'all') list = list.filter(o => o.status === activeTab.value)
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(o => o.userName.includes(kw) || o.roomTitle.toLowerCase().includes(kw))
  }
  return list
})

function statusType(s) {
  return { pending: 'warning', active: 'success', completed: '', cancelled: 'info' }[s] || 'info'
}
function statusLabel(s) {
  return { pending: '待确认', active: '进行中', completed: '已完成', cancelled: '已取消' }[s] || s
}

async function handleApprove(row) {
  try {
    await approveOrder(row.id)
    row.status = 'active'
    ElMessage.success(`订单 ${row.id} 已通过，系统已自动生成电子合同`)
  } catch (e) { console.error(e) }
}
async function handleReject(row) {
  try {
    await rejectOrder(row.id)
    row.status = 'cancelled'
    ElMessage.success(`订单 ${row.id} 已驳回`)
  } catch (e) { console.error(e) }
}
function handleComplete(row) {
  ElMessageBox.confirm('确定将该订单标记为完成吗？', '操作确认', { type: 'info' })
    .then(async () => {
      try {
        await updateOrderStatus(row.id, 'completed')
        row.status = 'completed'
        ElMessage.success('订单已完成')
      } catch (e) { console.error(e) }
    }).catch(() => {})
}

// ====== 转交管家功能 ======
async function loadManagers() {
  managersLoading.value = true
  managersError.value = ''
  try {
    console.log('[OrderManage] Fetching managers...')
    const res = await getManagerList()
    console.log('[OrderManage] Managers response:', JSON.stringify(res))
    managers.value = res.data || []
    console.log('[OrderManage] Managers loaded:', managers.value.length)
  } catch (e) {
    console.error('[OrderManage] Load managers failed:', e)
    managersError.value = e.message || '加载失败'
    // 即使失败也设置空数组，避免一直loading
    managers.value = []
  } finally {
    managersLoading.value = false
  }
}

async function handleAssign(row) {
  assigningOrder.value = row
  selectedManager.value = null
  assignDialogVisible.value = true
  await loadManagers()
}
async function confirmAssign() {
  try {
    await assignOrder(assigningOrder.value.id, selectedManager.value)
    const m = managers.value.find(m => m.user_id === selectedManager.value)
    assigningOrder.value.managerName = m?.name || ''
    assigningOrder.value.managerArea = m?.area || ''
    ElMessage.success(`订单已转交给管家「${m?.name}」`)
    assignDialogVisible.value = false
  } catch (e) { console.error(e) }
}

onMounted(() => {
  loadOrders()
  loadManagers() // 预加载管家列表
})
</script>

<style scoped>
.order-tabs { margin-bottom: 16px; }
.toolbar { display: flex; gap: 12px; margin-bottom: 16px; }
</style>
