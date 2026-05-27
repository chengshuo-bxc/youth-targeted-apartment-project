<template>
  <div class="contracts-page">
    <h2 class="section-title">我的合同</h2>
    <el-card v-for="contract in myContracts" :key="contract.id" class="contract-card" shadow="hover">
      <div class="contract-header">
        <div>
          <h3>合同 #{{ contract.id }}</h3>
          <p>{{ contract.roomTitle }}</p>
        </div>
        <el-tag :type="contract.status === 'active' ? 'success' : 'info'" effect="dark">
          {{ contract.status === 'active' ? '生效中' : '已到期' }}
        </el-tag>
      </div>
      <el-descriptions :column="2" border style="margin-top: 16px;">
        <el-descriptions-item label="承租方">{{ contract.userName }}</el-descriptions-item>
        <el-descriptions-item label="月租金">¥{{ contract.rent }}</el-descriptions-item>
        <el-descriptions-item label="押金">¥{{ contract.deposit }}</el-descriptions-item>
        <el-descriptions-item label="签署日期">{{ contract.signDate }}</el-descriptions-item>
        <el-descriptions-item label="起始日期">{{ contract.startDate }}</el-descriptions-item>
        <el-descriptions-item label="截止日期">{{ contract.endDate }}</el-descriptions-item>
      </el-descriptions>
      <el-divider />
      <div class="contract-content">
        <h4>合同内容摘要</h4>
        <pre class="content-text">{{ contract.content }}</pre>
      </div>
      <div class="contract-actions">
        <el-button type="primary" plain size="small" @click="viewContract(contract)">查看完整合同</el-button>
      </div>
    </el-card>
    <el-empty v-if="myContracts.length === 0" description="暂无合同" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getMyContracts } from '@/api'
import { ElMessage } from 'element-plus'

const myContracts = ref([])

async function loadContracts() {
  try {
    const { data } = await getMyContracts()
    myContracts.value = (data || []).map(item => ({
      id: item.contract_id ?? item.id,
      roomTitle: item.room_title ?? item.roomTitle ?? '',
      userName: item.user_name ?? item.userName ?? '',
      status: item.status,
      rent: item.rent_amount ?? item.rent ?? 0,
      deposit: item.deposit ?? 0,
      signDate: item.sign_date ?? item.signDate ?? '',
      startDate: item.start_date ?? item.startDate ?? '',
      endDate: item.end_date ?? item.endDate ?? '',
      content: item.content || '暂无合同内容'
    }))
  } catch (e) {
    console.error(e)
  }
}

onMounted(loadContracts)

function viewContract(contract) {
  ElMessage.info('合同预览功能（完整版需对接电子合同服务）')
}
</script>

<style scoped>
.contracts-page {
  max-width: 1800px;
  width: 100%;
  box-sizing: border-box;
}

.contract-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.contract-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.contract-header h3 {
  font-size: 18px;
  color: #303133;
  margin-bottom: 4px;
}

.contract-header p {
  font-size: 14px;
  color: #909399;
}

.content-text {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.8;
  color: #606266;
  white-space: pre-wrap;
  font-family: inherit;
  max-height: 200px;
  overflow-y: auto;
}

.contract-actions {
  margin-top: 16px;
  text-align: right;
}
</style>
