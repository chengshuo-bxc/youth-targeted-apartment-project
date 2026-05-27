<template>
  <div class="contract-manage">
    <h2 class="section-title">合同管理</h2>
    <el-card shadow="never">
      <el-table :data="contractList" stripe border>
        <el-table-column prop="id" label="合同号" width="80" />
        <el-table-column prop="userName" label="承租方" width="90" />
        <el-table-column prop="roomTitle" label="房源" min-width="160" />
        <el-table-column prop="startDate" label="起始日期" width="110" />
        <el-table-column prop="endDate" label="截止日期" width="110" />
        <el-table-column prop="rent" label="月租金" width="90">
          <template #default="{ row }">
            <span style="color: #F56C6C;">¥{{ row.rent }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deposit" label="押金" width="90">
          <template #default="{ row }">
            ¥{{ row.deposit }}
          </template>
        </el-table-column>
        <el-table-column prop="signDate" label="签署日期" width="110" />
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === 'active' ? 'success' : 'info'">
              {{ row.status === 'active' ? '生效中' : '已到期' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="viewDetail(row)">查看详情</el-button>
            <el-button size="small" type="warning" text @click="terminateContract(row)">终止合同</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="合同详情" width="650px">
      <el-descriptions :column="2" border v-if="currentContract">
        <el-descriptions-item label="合同编号">{{ currentContract.id }}</el-descriptions-item>
        <el-descriptions-item label="承租方">{{ currentContract.userName }}</el-descriptions-item>
        <el-descriptions-item label="房源">{{ currentContract.roomTitle }}</el-descriptions-item>
        <el-descriptions-item label="月租金">¥{{ currentContract.rent }}</el-descriptions-item>
        <el-descriptions-item label="押金">¥{{ currentContract.deposit }}</el-descriptions-item>
        <el-descriptions-item label="签署日期">{{ currentContract.signDate }}</el-descriptions-item>
        <el-descriptions-item label="起始日期">{{ currentContract.startDate }}</el-descriptions-item>
        <el-descriptions-item label="截止日期">{{ currentContract.endDate }}</el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <pre class="contract-text" v-if="currentContract">{{ currentContract.content }}</pre>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContractList } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const contractList = ref([])
const detailVisible = ref(false)
const currentContract = ref(null)

async function loadContracts() {
  try {
    const { data } = await getContractList()
    contractList.value = (data || []).map(item => ({
      id: item.contract_id ?? item.id,
      userName: item.user_name ?? item.userName ?? '',
      roomTitle: item.room_title ?? item.roomTitle ?? '',
      startDate: item.start_date ?? item.startDate ?? '',
      endDate: item.end_date ?? item.endDate ?? '',
      rent: item.rent_amount ?? item.rent ?? 0,
      deposit: item.deposit ?? 0,
      signDate: item.sign_date ?? item.signDate ?? '',
      status: item.status,
      content: item.content || '暂无合同内容'
    }))
  } catch (e) {
    console.error(e)
  }
}

onMounted(loadContracts)

function viewDetail(row) {
  currentContract.value = row
  detailVisible.value = true
}

function terminateContract(row) {
  ElMessageBox.confirm(`确定要终止合同 #${row.id} 吗？此操作不可恢复。`, '终止确认', { type: 'warning' })
    .then(() => {
      row.status = 'expired'
      ElMessage.success('合同已终止')
    }).catch(() => {})
}
</script>

<style scoped>
.contract-text {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.8;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
  font-family: inherit;
}
</style>
