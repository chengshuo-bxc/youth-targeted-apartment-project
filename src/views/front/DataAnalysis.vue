<template>
  <div class="analysis-page">
    <!-- Banner -->
    <div class="page-banner">
      <div class="page-banner-overlay"></div>
      <div class="page-banner-content">
        <h1>数据分析</h1>
        <p>实时查看房源状态、类型、价格等统计数据</p>
      </div>
    </div>

    <!-- 汇总卡片 -->
    <div class="summary-section">
      <div class="summary-grid">
        <div class="summary-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">
            <el-icon :size="28" color="#fff"><House /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ summary.totalRooms }}</div>
            <div class="card-label">房源总数</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #43e97b, #38f9d7);">
            <el-icon :size="28" color="#fff"><Key /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ summary.availableRooms }}</div>
            <div class="card-label">可租房源</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #fa709a, #fee140);">
            <el-icon :size="28" color="#fff"><User /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ summary.totalTenants }}</div>
            <div class="card-label">注册租客</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #a18cd1, #fbc2eb);">
            <el-icon :size="28" color="#fff"><Money /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">¥{{ summary.avgPrice }}</div>
            <div class="card-label">平均租金</div>
          </div>
        </div>
        <div class="summary-card">
          <div class="card-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
            <el-icon :size="28" color="#fff"><DataLine /></el-icon>
          </div>
          <div class="card-info">
            <div class="card-value">{{ summary.avgArea }}㎡</div>
            <div class="card-label">平均面积</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <el-row :gutter="24">
        <!-- 房源状态分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <h3 class="chart-title">
              <el-icon><PieChart /></el-icon> 房源状态分布
            </h3>
            <div class="chart-container" ref="statusChartRef"></div>
          </div>
        </el-col>
        
        <!-- 房源类型分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <h3 class="chart-title">
              <el-icon><DataAnalysis /></el-icon> 房源类型分布
            </h3>
            <div class="chart-container" ref="typeChartRef"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 24px;">
        <!-- 价格区间分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <h3 class="chart-title">
              <el-icon><TrendCharts /></el-icon> 价格区间分布
            </h3>
            <div class="chart-container" ref="priceChartRef"></div>
          </div>
        </el-col>
        
        <!-- 面积区间分布 -->
        <el-col :span="12">
          <div class="chart-card">
            <h3 class="chart-title">
              <el-icon><Grid /></el-icon> 面积区间分布
            </h3>
            <div class="chart-container" ref="areaChartRef"></div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 24px;">
        <!-- 热门区域 -->
        <el-col :span="12">
          <div class="chart-card">
            <h3 class="chart-title">
              <el-icon><Location /></el-icon> 热门区域分布
            </h3>
            <div class="chart-container" ref="locationChartRef"></div>
          </div>
        </el-col>
        
        <!-- 配套设施统计 -->
        <el-col :span="12">
          <div class="chart-card">
            <h3 class="chart-title">
              <el-icon><List /></el-icon> 配套设施统计
            </h3>
            <div class="chart-container" ref="facilityChartRef"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getAnalysisStats } from '@/api'
import { House, Key, User, Money, DataLine, PieChart, DataAnalysis, TrendCharts, Grid, Location, List } from '@element-plus/icons-vue'

const statusChartRef = ref(null)
const typeChartRef = ref(null)
const priceChartRef = ref(null)
const areaChartRef = ref(null)
const locationChartRef = ref(null)
const facilityChartRef = ref(null)

let statusChart = null
let typeChart = null
let priceChart = null
let areaChart = null
let locationChart = null
let facilityChart = null

const summary = ref({
  totalRooms: 0,
  availableRooms: 0,
  rentedRooms: 0,
  reservedRooms: 0,
  totalTenants: 0,
  avgPrice: 0,
  avgArea: 0
})

const statusStats = ref([])
const typeStats = ref([])
const priceStats = ref([])
const areaStats = ref([])
const locationStats = ref([])
const facilityStats = ref([])

const statusLabelMap = {
  available: '可租',
  rented: '已租',
  reserved: '已预订'
}

const statusColorMap = {
  available: '#67C23A',
  rented: '#F56C6C',
  reserved: '#E6A23C'
}

onMounted(async () => {
  await fetchData()
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  statusChart?.dispose()
  typeChart?.dispose()
  priceChart?.dispose()
  areaChart?.dispose()
  locationChart?.dispose()
  facilityChart?.dispose()
})

async function fetchData() {
  try {
    const res = await getAnalysisStats()
    if (res.code === 200) {
      summary.value = res.data.summary
      statusStats.value = res.data.statusStats
      typeStats.value = res.data.typeStats
      priceStats.value = res.data.priceStats
      areaStats.value = res.data.areaStats
      locationStats.value = res.data.locationStats
      facilityStats.value = res.data.facilityStats
    }
  } catch (e) {
    console.error('获取统计数据失败:', e)
  }
}

function initCharts() {
  // 房源状态饼图
  statusChart = echarts.init(statusChartRef.value)
  statusChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 10, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{c}套' },
      data: statusStats.value.map(item => ({
        name: statusLabelMap[item.status] || item.status,
        value: item.count,
        itemStyle: { color: statusColorMap[item.status] }
      }))
    }]
  })

  // 房源类型柱状图
  typeChart = echarts.init(typeChartRef.value)
  typeChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: typeStats.value.map(i => i.type),
      axisLabel: { rotate: 30, fontSize: 11 }
    },
    yAxis: { type: 'value', name: '数量' },
    series: [{
      type: 'bar',
      data: typeStats.value.map(i => i.count),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ]),
        borderRadius: [6, 6, 0, 0]
      },
      label: { show: true, position: 'top', color: '#666' }
    }]
  })

  // 价格区间柱状图
  priceChart = echarts.init(priceChartRef.value)
  priceChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: priceStats.value.map(i => i.price_range),
      axisLabel: { fontSize: 11 }
    },
    yAxis: { type: 'value', name: '数量' },
    series: [{
      type: 'bar',
      data: priceStats.value.map(i => i.count),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#fa709a' },
          { offset: 1, color: '#fee140' }
        ]),
        borderRadius: [6, 6, 0, 0]
      },
      label: { show: true, position: 'top', color: '#666' }
    }]
  })

  // 面积区间饼图
  areaChart = echarts.init(areaChartRef.value)
  areaChart.setOption({
    tooltip: { trigger: 'item', formatter: '{b}: {c}套 ({d}%)' },
    legend: { bottom: 10, left: 'center' },
    series: [{
      type: 'pie',
      radius: ['35%', '65%'],
      center: ['50%', '45%'],
      roseType: 'radius',
      itemStyle: { borderRadius: 5 },
      label: { show: true, fontSize: 11 },
      data: areaStats.value.map((item, index) => ({
        name: item.area_range,
        value: item.count,
        itemStyle: {
          color: ['#667eea', '#43e97b', '#fa709a', '#a18cd1', '#f093fb'][index % 5]
        }
      }))
    }]
  })

  // 热门区域横向柱状图
  locationChart = echarts.init(locationChartRef.value)
  locationChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '10%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', name: '房源数' },
    yAxis: {
      type: 'category',
      data: locationStats.value.map(i => i.district || '未知区域'),
      axisLabel: { fontSize: 11 }
    },
    series: [{
      type: 'bar',
      data: locationStats.value.map(i => i.count),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#4facfe' },
          { offset: 1, color: '#00f2fe' }
        ]),
        borderRadius: [0, 6, 6, 0]
      },
      label: { show: true, position: 'right', color: '#666' }
    }]
  })

  // 配套设施柱状图
  facilityChart = echarts.init(facilityChartRef.value)
  facilityChart.setOption({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '20%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      data: facilityStats.value.map(i => i.name),
      axisLabel: { rotate: 45, fontSize: 10 }
    },
    yAxis: { type: 'value', name: '房源数' },
    series: [{
      type: 'bar',
      data: facilityStats.value.map(i => i.count),
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#43e97b' },
          { offset: 1, color: '#38f9d7' }
        ]),
        borderRadius: [6, 6, 0, 0]
      },
      label: { show: true, position: 'top', color: '#666', fontSize: 10 }
    }]
  })
}

function handleResize() {
  statusChart?.resize()
  typeChart?.resize()
  priceChart?.resize()
  areaChart?.resize()
  locationChart?.resize()
  facilityChart?.resize()
}
</script>

<style scoped>
.analysis-page {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}

/* ===== Page Banner ===== */
.page-banner {
  position: relative;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 28px;
  background: url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=300&fit=crop') center/cover;
}

.page-banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(79, 56, 150, 0.75), rgba(30, 47, 95, 0.65));
}

.page-banner-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.page-banner-content h1 {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.page-banner-content p {
  font-size: 15px;
  opacity: 0.9;
}

/* ===== Summary Section ===== */
.summary-section {
  margin-bottom: 28px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}

.summary-card {
  background: #fff;
  border-radius: 14px;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-value {
  font-size: 26px;
  font-weight: 800;
  color: #303133;
  line-height: 1.2;
}

.card-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

/* ===== Charts Section ===== */
.charts-section {
  padding-bottom: 40px;
}

.chart-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-container {
  height: 300px;
  width: 100%;
}

@media (max-width: 1400px) {
  .summary-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>