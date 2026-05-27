<template>
  <div class="payment-manage">
    <h2 class="section-title">缴费管理</h2>
    <el-card shadow="never">
      <div class="toolbar">
        <el-select v-model="filterStatus" placeholder="缴费状态" clearable style="width: 140px;">
          <el-option label="已缴" value="paid" />
          <el-option label="未缴" value="unpaid" />
        </el-select>
        <el-select v-model="filterType" placeholder="费用类型" clearable style="width: 140px;">
          <el-option label="租金" value="租金" />
          <el-option label="押金" value="押金" />
          <el-option label="水费" value="水费" />
          <el-option label="电费" value="电费" />
        </el-select>
        <el-input v-model="keyword" placeholder="搜索租客/房源" clearable style="width: 220px;" prefix-icon="Search" />
      </div>

      <el-table :data="filteredPayments" stripe border>
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column prop="userName" label="租客" width="80" />
        <el-table-column prop="roomTitle" label="房源" min-width="140" />
        <el-table-column prop="type" label="费用类型" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="feeType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="账期" width="100" />
        <el-table-column prop="amount" label="金额" width="90">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 600;">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === 'paid' ? 'success' : 'danger'">
              {{ row.status === 'paid' ? '已缴' : '未缴' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="payTime" label="缴费时间" width="170">
          <template #default="{ row }">{{ row.payTime || '-' }}</template>
        </el-table-column>
        <el-table-column prop="method" label="支付方式" width="110">
          <template #default="{ row }">{{ row.method || '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'unpaid'" size="small" type="primary" @click="handleConfirmPay(row)">确认收款</el-button>
            <el-button v-if="row.status === 'paid'" size="small" type="info" text>已处理</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 汇总 -->
      <div class="pay-summary" v-if="filteredPayments.length > 0">
        <span>共 <b>{{ filteredPayments.length }}</b> 条记录</span>
        <span>已缴 <b style="color: #67C23A;">¥{{ paidTotal }}</b></span>
        <span>待缴 <b style="color: #F56C6C;">¥{{ unpaidTotal }}</b></span>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getPaymentList } from '@/api'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const keyword = ref('')
const filterStatus = ref('')
const filterType = ref('')
const paymentList = ref([])

async function loadPayments() {
  try {
    const { data } = await getPaymentList()
    paymentList.value = (data || []).map(item => ({
      id: item.payment_id ?? item.id,
      userName: item.user_name ?? item.userName ?? '',
      roomTitle: item.room_title ?? item.roomTitle ?? '',
      type: item.type,
      period: item.period || '',
      amount: Number(item.amount),
      status: item.status,
      payTime: item.pay_time ?? item.payTime ?? '',
      method: item.method || ''
    }))
  } catch (e) {
    console.error(e)
  }
}

onMounted(loadPayments)

const filteredPayments = computed(() => {
  let list = paymentList.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(p => p.userName.includes(kw) || p.roomTitle.toLowerCase().includes(kw))
  }
  if (filterStatus.value) list = list.filter(p => p.status === filterStatus.value)
  if (filterType.value) list = list.filter(p => p.type === filterType.value)
  return list
})

const paidTotal = computed(() => filteredPayments.value.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0))
const unpaidTotal = computed(() => filteredPayments.value.filter(p => p.status === 'unpaid').reduce((s, p) => s + p.amount, 0))

function feeType(type) {
  return { '租金': '', '押金': 'warning', '水费': 'info', '电费': 'info' }[type] || 'info'
}

function handleConfirmPay(row) {
  row.status = 'paid'
  row.payTime = new Date().toLocaleString()
  row.method = '线下收款'
  ElMessage.success('已确认收款')
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.pay-summary {
  margin-top: 16px;
  padding: 12px 16px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  gap: 32px;
  font-size: 14px;
  color: #606266;
}
</style>
