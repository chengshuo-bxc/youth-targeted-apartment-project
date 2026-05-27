<template>
  <div class="payments-page">
    <h2 class="section-title">缴费记录</h2>
    <el-card>
      <el-table :data="myPayments" stripe style="width: 100%">
        <el-table-column prop="id" label="编号" width="60" />
        <el-table-column prop="roomTitle" label="房源" min-width="160" />
        <el-table-column prop="type" label="费用类型" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="feeType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="period" label="账期" width="100" />
        <el-table-column prop="amount" label="金额" width="100">
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
          <template #default="{ row }">
            {{ row.payTime || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="method" label="支付方式" width="100">
          <template #default="{ row }">
            {{ row.method || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'unpaid'"
              type="primary"
              size="small"
              @click="handlePay(row)"
            >去缴费</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 汇总 -->
      <div class="payment-summary" v-if="myPayments.length > 0">
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="总缴费笔数">{{ myPayments.length }}</el-descriptions-item>
          <el-descriptions-item label="已缴金额">¥{{ paidTotal }}</el-descriptions-item>
          <el-descriptions-item label="待缴金额">
            <span style="color: #F56C6C; font-weight: 600;">¥{{ unpaidTotal }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getMyPayments, payPayment } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const myPayments = ref([])

async function loadPayments() {
  try {
    const { data } = await getMyPayments()
    myPayments.value = (data || []).map(item => ({
      id: item.payment_id ?? item.id,
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

const paidTotal = computed(() => myPayments.value.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0))
const unpaidTotal = computed(() => myPayments.value.filter(p => p.status === 'unpaid').reduce((s, p) => s + p.amount, 0))

function feeType(type) {
  const map = { '租金': '', '押金': 'warning', '水费': 'info', '电费': 'info' }
  return map[type] || 'info'
}

async function handlePay(row) {
  try {
    await ElMessageBox.confirm(`确认缴纳 ${row.type} ¥${row.amount}（${row.period}）？`, '缴费确认', {
      type: 'info',
      confirmButtonText: '确认缴费',
      cancelButtonText: '取消'
    })
    const res = await payPayment(row.id, '支付宝（沙箱）')
    row.status = 'paid'
    row.payTime = new Date().toLocaleString()
    row.method = '支付宝（沙箱）'
    // 检查是否所有费用已缴清
    const unpaidCount = myPayments.value.filter(p => p.status === 'unpaid').length
    if (unpaidCount === 0 || (unpaidCount === 1 && row.status === 'paid')) {
      ElMessage.success('缴费成功！所有费用已缴清，房源已正式租出！')
    } else {
      ElMessage.success(res.message || '缴费成功！')
    }
  } catch (e) { /* cancelled or error */ }
}
</script>

<style scoped>
.payments-page {
  max-width: 1800px;
  width: 100%;
  box-sizing: border-box;
}

.payment-summary {
  margin-top: 20px;
}
</style>
