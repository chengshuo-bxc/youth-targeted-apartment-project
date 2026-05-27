<template>
  <div class="dashboard-page">
    <h2 class="section-title">数据概览</h2>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="item in statCards" :key="item.label">
        <el-card shadow="hover" class="stat-card" :body-style="{ padding: '24px' }">
          <div class="stat-icon" :style="{ background: item.bg }">
            <el-icon :size="28" color="#fff"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stat-detail">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">房源状态分布</span>
              <el-tag size="small">共 {{ stats.totalRooms }} 套</el-tag>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">收入统计</span>
              <el-tag size="small" type="success">累计 ¥{{ stats.totalRevenue.toLocaleString() }}</el-tag>
            </div>
          </template>
          <div ref="barChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- 最近订单 -->
      <el-col :span="14">
        <el-card shadow="never">
          <template #header>
            <div class="chart-header">
              <span class="chart-title">最近订单</span>
              <el-button type="primary" link @click="$router.push('/admin/orders')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="orders.slice(0, 5)" size="small">
            <el-table-column prop="id" label="订单号" width="70" />
            <el-table-column prop="userName" label="租客" width="80" />
            <el-table-column prop="roomTitle" label="房源" />
            <el-table-column prop="status" label="状态" width="80">
              <template #default="{ row }">
                <el-tag size="small" :type="orderStatusType(row.status)">{{ orderStatusLabel(row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="时间" width="110" />
          </el-table>
        </el-card>
      </el-col>

      <!-- 缴费统计 -->
      <el-col :span="10">
        <el-card shadow="never">
          <template #header><span style="font-weight: 600;">缴费概况</span></template>
          <div class="payment-stats">
            <div class="pay-stat-item">
              <span class="pay-label">总缴费笔数</span>
              <span class="pay-value">{{ stats.totalPayments }}</span>
            </div>
            <div class="pay-stat-item">
              <span class="pay-label">已缴费</span>
              <span class="pay-value success">{{ stats.paidPayments }}</span>
            </div>
            <div class="pay-stat-item">
              <span class="pay-label">未缴费</span>
              <span class="pay-value danger">{{ stats.unpaidPayments }}</span>
            </div>
            <el-divider />
            <div class="pay-stat-item">
              <span class="pay-label">累计收入</span>
              <span class="pay-value primary">¥{{ stats.totalRevenue.toLocaleString() }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getStats, getOrderList } from '@/api'
import { House, User, List, Wallet } from '@element-plus/icons-vue'

// 延迟动态导入 echarts，避免加载失败导致整个模块崩溃
let echarts = null
async function loadEcharts() {
  try {
    const mod = await import('echarts')
    echarts = mod.default || mod
    return true
  } catch (e) {
    console.warn('echarts 加载失败，图表将不显示', e)
    return false
  }
}

const stats = ref({
  totalRooms: 0, availableRooms: 0, rentedRooms: 0, reservedRooms: 0,
  totalTenants: 0, totalOrders: 0, totalRevenue: 0,
  totalPayments: 0, paidPayments: 0, unpaidPayments: 0,
})
const orders = ref([])
const statCards = ref([])

// 图表引用
const pieChartRef = ref(null)
const barChartRef = ref(null)
let pieChart = null
let barChart = null

function updateStatCards() {
  const s = stats.value
  statCards.value = [
    { label: '房源总数', value: s.totalRooms, icon: House, bg: 'linear-gradient(135deg, #667eea, #764ba2)' },
    { label: '租客总数', value: s.totalTenants, icon: User, bg: 'linear-gradient(135deg, #f093fb, #f5576c)' },
    { label: '订单总数', value: s.totalOrders, icon: List, bg: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
    { label: '累计收入', value: '¥' + s.totalRevenue.toLocaleString(), icon: Wallet, bg: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  ]
}

function orderStatusType(s) {
  return { pending: 'warning', active: 'success', completed: '', cancelled: 'info' }[s] || 'info'
}
function orderStatusLabel(s) {
  return { pending: '待确认', active: '进行中', completed: '已完成', cancelled: '已取消' }[s] || s
}

// 初始化饼图
async function initPieChart() {
  if (!echarts || !pieChartRef.value) return
  
  pieChart = echarts.init(pieChartRef.value)
  const s = stats.value
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}套 ({d}%)'
    },
    legend: {
      bottom: '5%',
      left: 'center'
    },
    series: [{
      name: '房源状态',
      type: 'pie',
      radius: ['45%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}\n{c}套'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      data: [
        { value: s.availableRooms, name: '可租', itemStyle: { color: '#67C23A' } },
        { value: s.reservedRooms, name: '已预订', itemStyle: { color: '#E6A23C' } },
        { value: s.rentedRooms, name: '已租', itemStyle: { color: '#F56C6C' } }
      ]
    }]
  }
  
  pieChart.setOption(option)
}

// 初始化柱状图
async function initBarChart() {
  if (!echarts || !barChartRef.value) return
  
  barChart = echarts.init(barChartRef.value)
  const s = stats.value
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['已缴费', '未缴费']
    },
    yAxis: {
      type: 'value',
      name: '笔数'
    },
    series: [{
      name: '缴费笔数',
      type: 'bar',
      barWidth: '50%',
      data: [
        { 
          value: s.paidPayments, 
          itemStyle: { 
            color: '#67C23A',
            borderRadius: [8, 8, 0, 0]
          }
        },
        { 
          value: s.unpaidPayments, 
          itemStyle: { 
            color: '#F56C6C',
            borderRadius: [8, 8, 0, 0]
          }
        }
      ]
    }]
  }
  
  barChart.setOption(option)
}

// 窗口大小变化时重绘图表
function handleResize() {
  pieChart?.resize()
  barChart?.resize()
}

async function loadStats() {
  try {
    const { data } = await getStats()
    stats.value = data
    updateStatCards()
    // 先动态加载 echarts，再初始化图表
    const ok = await loadEcharts()
    if (ok) {
      setTimeout(() => {
        initPieChart()
        initBarChart()
      }, 100)
    }
  } catch (e) {
    console.error('获取统计数据失败', e)
  }
}

async function loadOrders() {
  try {
    const { data } = await getOrderList()
    orders.value = data.map(o => ({
      ...o,
      id: o.order_id ?? o.id,
      userName: o.user_name ?? o.userName,
      roomTitle: o.room_title ?? o.roomTitle,
      createTime: o.create_time ? o.create_time.slice(0, 10) : (o.createTime || ''),
    }))
  } catch (e) {
    console.error('获取订单列表失败', e)
  }
}

onMounted(() => {
  loadStats()
  loadOrders()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  pieChart?.dispose()
  barChart?.dispose()
})
</script>

<style scoped>
.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-card {
  border-radius: 12px;
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chart-title {
  font-weight: 600;
  font-size: 15px;
}

.chart-container {
  height: 300px;
}

.payment-stats {
  padding: 8px 0;
}

.pay-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 14px;
}

.pay-label {
  color: #606266;
}

.pay-value {
  font-size: 20px;
  font-weight: 700;
  color: #303133;
}

.pay-value.success { color: #67C23A; }
.pay-value.danger { color: #F56C6C; }
.pay-value.primary { color: #409EFF; }
</style>