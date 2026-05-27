<template>
  <div class="orders-page">
    <h2 class="section-title">我的订单</h2>

    <!-- 待缴费提醒 -->
    <el-alert
      v-if="hasUnpaidPayments"
      title="您有待缴费的费用，请及时缴纳，缴费完成后即可入住"
      type="warning"
      show-icon
      :closable="false"
      style="margin-bottom: 16px;"
    >
      <template #default>
        <span>您的订单已通过审核，请前往 <router-link to="/user/payments" style="color: #E6A23C; font-weight: 600;">我的缴费</router-link> 完成缴费</span>
      </template>
    </el-alert>

    <el-card>
      <el-tabs v-model="activeTab" class="order-tabs">
        <el-tab-pane label="全部" name="all"></el-tab-pane>
        <el-tab-pane label="待确认" name="pending"></el-tab-pane>
        <el-tab-pane label="进行中" name="active"></el-tab-pane>
        <el-tab-pane label="已完成" name="completed"></el-tab-pane>
        <el-tab-pane label="已取消" name="cancelled"></el-tab-pane>
      </el-tabs>
      <el-table :data="filteredOrders" stripe style="width: 100%">
        <el-table-column prop="id" label="订单号" width="80" />
        <el-table-column prop="roomTitle" label="房源" min-width="180" />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="row.type === '预订' ? '' : 'warning'">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="checkIn" label="入住日期" width="120" />
        <el-table-column prop="checkOut" label="退租日期" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button v-if="row.status === 'active'" type="warning" size="small" @click="handleCancel(row)">退租申请</el-button>
            <el-tag v-else-if="row.status === 'pending'" type="info" size="small">等待审核</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-empty v-if="filteredOrders.length === 0" description="暂无订单" />
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMyOrders, getMyPayments, updateOrderStatus } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('all')
const orderList = ref([])
const hasUnpaidPayments = ref(false)

async function loadOrders() {
  try {
    const { data } = await getMyOrders()
    orderList.value = (data || []).map(item => ({
      id: item.order_id ?? item.id,
      roomTitle: item.room_title ?? item.roomTitle ?? '',
      type: item.type ?? '预订',
      checkIn: item.check_in ? item.check_in.slice(0, 10) : (item.checkIn || ''),
      checkOut: item.check_out ? item.check_out.slice(0, 10) : (item.checkOut || ''),
      status: item.status,
      createTime: item.create_time ? item.create_time.slice(0, 10) : (item.createTime || '')
    }))
  } catch (e) {
    console.error(e)
  }
}

async function checkUnpaidPayments() {
  try {
    const { data } = await getMyPayments()
    hasUnpaidPayments.value = (data || []).some(p => p.status === 'unpaid')
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  loadOrders()
  checkUnpaidPayments()
})

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orderList.value
  return orderList.value.filter(o => o.status === activeTab.value)
})

function statusType(s) {
  return { pending: 'warning', active: 'success', completed: '', cancelled: 'info' }[s] || 'info'
}
function statusLabel(s) {
  return { pending: '待确认', active: '进行中', completed: '已完成', cancelled: '已取消' }[s] || s
}

async function handleCancel(row) {
  try {
    await ElMessageBox.confirm('确定要申请退租吗？退租后需要结算相关费用。', '退租确认', {
      type: 'warning'
    })
    await updateOrderStatus(row.id, 'cancelled')
    row.status = 'cancelled'
    ElMessage.success('退租申请已提交')
  } catch (e) { /* cancelled or error */ }
}
</script>

<style scoped>
.orders-page {
  max-width: 1800px;
  width: 100%;
  box-sizing: border-box;
}

.order-tabs {
  margin-bottom: 16px;
}
</style>
