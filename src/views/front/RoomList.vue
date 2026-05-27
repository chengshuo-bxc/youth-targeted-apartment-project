<template>
  <div class="room-list-page">
    <!-- 顶部 Banner -->
    <div class="page-banner">
      <div class="page-banner-overlay"></div>
      <div class="page-banner-content">
        <h1>房源列表</h1>
        <p>共 <b>{{ roomsData.length }}</b> 套优质房源，找到你的理想居所</p>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-section">
      <div class="filter-bar">
        <div class="filter-group">
          <el-input v-model="filters.keyword" placeholder="搜索房源名称/地址" clearable class="filter-input" @keyup.enter="doSearch">
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-select v-model="filters.type" placeholder="房型" clearable>
            <el-option v-for="t in roomTypes" :key="t" :label="t" :value="t" />
          </el-select>
          <el-select v-model="filters.status" placeholder="状态" clearable>
            <el-option label="可租" value="available" />
            <el-option label="已预订" value="reserved" />
            <el-option label="已租" value="rented" />
          </el-select>
          <el-select v-model="filters.priceRange" placeholder="价格范围" clearable>
            <el-option label="800元以下" value="0-800" />
            <el-option label="800-1500元" value="800-1500" />
            <el-option label="1500-2000元" value="1500-2000" />
            <el-option label="2000元以上" value="2000-99999" />
          </el-select>
        </div>
        <div class="filter-actions">
          <el-button type="primary" @click="doSearch">
            <el-icon><Search /></el-icon> 搜索
          </el-button>
          <el-button @click="resetFilters">重置</el-button>
        </div>
      </div>
      <div class="active-filters" v-if="hasActiveFilter">
        <span class="filter-label">当前筛选：</span>
        <el-tag v-if="filters.keyword" closable @close="filters.keyword = ''" type="primary" size="small" effect="plain">
          关键词: {{ filters.keyword }}
        </el-tag>
        <el-tag v-if="filters.type" closable @close="filters.type = ''" type="success" size="small" effect="plain">
          房型: {{ filters.type }}
        </el-tag>
        <el-tag v-if="filters.status" closable @close="filters.status = ''" type="warning" size="small" effect="plain">
          状态: {{ statusLabel(filters.status) }}
        </el-tag>
        <el-tag v-if="filters.priceRange" closable @close="filters.priceRange = ''" type="danger" size="small" effect="plain">
          价格: {{ priceRangeLabel(filters.priceRange) }}
        </el-tag>
        <span class="result-count">找到 {{ filteredRooms.length }} 套房源</span>
      </div>
    </div>

    <!-- 房源列表 -->
    <div v-if="paginatedRooms.length > 0" class="rooms-grid">
      <div
        v-for="room in paginatedRooms"
        :key="room.id"
        class="room-card"
        @click="$router.push(`/rooms/${room.id}`)"
      >
        <div class="room-image">
          <img :src="room.images && room.images[0]" :alt="room.title" loading="lazy" @error="handleImageError" />
          <div class="image-overlay"></div>
          <el-tag class="room-status" :type="statusType(room.status)" size="small" effect="dark">
            {{ statusLabel(room.status) }}
          </el-tag>
          <el-tag v-if="room.tags && room.tags[0]" class="room-tag-top" type="primary" effect="dark" size="small">
            {{ room.tags[0] }}
          </el-tag>
          <div class="image-bottom-info">
            <span class="room-type-badge">{{ room.type }}</span>
            <span class="room-area">{{ room.area }}m²</span>
          </div>
        </div>
        <div class="room-info">
          <h3 class="room-title">{{ room.title }}</h3>
          <p class="room-address">
            <el-icon><Location /></el-icon> {{ room.address }}
          </p>
          <div class="room-tags" v-if="room.tags && room.tags.length">
            <el-tag v-for="tag in room.tags.slice(0, 3)" :key="tag" size="small" type="info" effect="plain" round>{{ tag }}</el-tag>
          </div>
          <div class="room-bottom">
            <div class="room-price">
              <span class="price-symbol">¥</span>
              <span class="price-num">{{ room.price }}</span>
              <span class="price-unit">/月</span>
            </div>
            <span class="room-floor">{{ room.floor }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination-wrapper" v-if="filteredRooms.length > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="filteredRooms.length"
        layout="prev, pager, next, jumper"
        background
      />
    </div>

    <el-empty v-if="filteredRooms.length === 0" description="暂无符合条件的房源">
      <el-button type="primary" @click="resetFilters">重置筛选条件</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getFrontRooms } from '@/api'
import { Search, Location } from '@element-plus/icons-vue'

const route = useRoute()
const roomTypes = ['单间', '双人间', '一室一厅', '两室一厅', '三室一厅', 'LOFT', '床位']

const roomsData = ref([])
const currentPage = ref(1)
const pageSize = 9

const filters = ref({
  keyword: '',
  type: '',
  status: '',
  priceRange: ''
})

onMounted(async () => {
  const res = await getFrontRooms()
  roomsData.value = res.data.map(r => ({ ...r, id: r.house_id }))
  if (route.query.keyword) {
    filters.value.keyword = route.query.keyword
  }
})

const hasActiveFilter = computed(() => {
  const f = filters.value
  return f.keyword || f.type || f.status || f.priceRange
})

const filteredRooms = computed(() => {
  let list = [...roomsData.value]
  const f = filters.value
  if (f.keyword) {
    const kw = f.keyword.toLowerCase()
    list = list.filter(r => r.title.toLowerCase().includes(kw) || r.address.toLowerCase().includes(kw))
  }
  if (f.type) list = list.filter(r => r.type === f.type)
  if (f.status) list = list.filter(r => r.status === f.status)
  if (f.priceRange) {
    const [min, max] = f.priceRange.split('-').map(Number)
    list = list.filter(r => r.price >= min && r.price <= max)
  }
  return list
})

// 分页后的房源
const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredRooms.value.slice(start, end)
})

// 筛选条件改变时重置页码
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

function statusType(s) {
  return { available: 'success', reserved: 'warning', rented: 'danger' }[s] || 'info'
}
function statusLabel(s) {
  return { available: '可租', reserved: '已预订', rented: '已租' }[s] || s
}
function priceRangeLabel(range) {
  const map = { '0-800': '800元以下', '800-1500': '800-1500元', '1500-2000': '1500-2000元', '2000-99999': '2000元以上' }
  return map[range] || range
}

function doSearch() {
  // 筛选是 computed 自动的
}

function resetFilters() {
  filters.value = { keyword: '', type: '', status: '', priceRange: '' }
}

function handleImageError(e) {
  e.target.src = '/images/room-placeholder.svg'
}
</script>

<style scoped>
.room-list-page {
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
  background: url('https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1400&h=300&fit=crop') center/cover;
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

/* ===== Filter ===== */
.filter-section {
  margin-bottom: 28px;
}

.filter-bar {
  background: #fff;
  border-radius: 14px;
  padding: 20px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  flex: 1;
}

.filter-group .el-input,
.filter-group .el-select {
  width: auto;
  min-width: 160px;
}

.filter-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.active-filters {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  flex-wrap: wrap;
  padding: 0 4px;
}

.filter-label {
  font-size: 13px;
  color: #909399;
}

.result-count {
  font-size: 13px;
  color: #409EFF;
  font-weight: 500;
  margin-left: auto;
}

/* ===== Rooms Grid ===== */
.rooms-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.room-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.room-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.room-image {
  position: relative;
  height: 190px;
  overflow: hidden;
}

.room-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.room-card:hover .room-image img {
  transform: scale(1.08);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.35));
  pointer-events: none;
}

.room-status {
  position: absolute;
  top: 12px;
  right: 12px;
  backdrop-filter: blur(4px);
}

.room-tag-top {
  position: absolute;
  top: 12px;
  left: 12px;
  backdrop-filter: blur(4px);
}

.image-bottom-info {
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
  display: flex;
  justify-content: space-between;
  z-index: 1;
}

.room-type-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 12px;
}

.room-area {
  color: rgba(255, 255, 255, 0.85);
  font-size: 12px;
}

.room-info {
  padding: 16px;
}

.room-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-address {
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.room-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.room-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
}

.room-price {
  display: flex;
  align-items: baseline;
}

.price-symbol {
  font-size: 14px;
  font-weight: 600;
  color: #F56C6C;
}

.price-num {
  font-size: 22px;
  font-weight: 800;
  color: #F56C6C;
  line-height: 1;
}

.price-unit {
  font-size: 12px;
  color: #909399;
  margin-left: 2px;
}

.room-floor {
  font-size: 12px;
  color: #b0b0b0;
}

/* ===== Pagination ===== */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 20px 0;
}
</style>
