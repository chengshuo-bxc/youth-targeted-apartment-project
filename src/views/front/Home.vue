<template>
  <div class="home-page">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-slides">
        <div
          v-for="(slide, i) in bannerSlides"
          :key="i"
          class="banner-slide"
          :class="{ active: currentSlide === i }"
          :style="{ backgroundImage: `url(${slide.img})` }"
        ></div>
      </div>
      <div class="banner-overlay"></div>
      <div class="banner-content">
        <h1 class="banner-title">青年公寓服务系统</h1>
        <p class="banner-subtitle">为都市青年打造温暖、便捷的居住空间</p>
        <div class="banner-search">
          <el-input
            v-model="searchKey"
            placeholder="搜索房源类型、地址..."
            size="large"
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button type="primary" size="large" @click="handleSearch">
            <el-icon><Search /></el-icon> 搜索房源
          </el-button>
        </div>
        <div class="hot-tags">
          <span class="hot-label">热门搜索：</span>
          <el-tag
            v-for="tag in hotTags"
            :key="tag"
            size="small"
            effect="plain"
            round
            class="hot-tag"
            @click="searchKey = tag; handleSearch()"
          >{{ tag }}</el-tag>
        </div>
      </div>
      <div class="banner-dots">
        <span
          v-for="(_, i) in bannerSlides"
          :key="i"
          class="dot"
          :class="{ active: currentSlide === i }"
          @click="currentSlide = i"
        ></span>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div v-for="item in statItems" :key="item.label" class="stat-card">
          <div class="stat-icon-wrap" :style="{ background: item.bg }">
            <el-icon :size="28" color="#fff"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ item.value }}</div>
            <div class="stat-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 精选房源 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon"></span>精选房源
        </h2>
        <el-button type="primary" text @click="$router.push('/rooms')">
          查看全部 <el-icon><ArrowRight /></el-icon>
        </el-button>
      </div>
      <div class="rooms-grid">
        <div
          v-for="room in featuredRooms"
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
    </div>

    <!-- 公告通知 -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon"></span>公告通知
        </h2>
      </div>
      <div class="announcements-grid">
        <div
          v-for="notice in announcementsData"
          :key="notice.id"
          class="announcement-card"
          @click="openAnnouncement(notice)"
        >
          <div class="ann-icon-wrap">
            <el-icon :size="22"><Bell /></el-icon>
          </div>
          <div class="ann-content">
            <h4 class="ann-title">{{ notice.title }}</h4>
            <p class="ann-preview">{{ (notice.content || '').slice(0, 100) }}...</p>
          </div>
          <div class="ann-right">
            <span class="ann-date">{{ notice.createTime }}</span>
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
      <el-empty v-if="announcementsData.length === 0" description="暂无公告" :image-size="60" />
    </div>

    <!-- 公告详情弹窗 -->
    <el-dialog v-model="announcementVisible" :title="currentAnnouncement?.title" width="620px">
      <div class="announcement-detail">
        <div class="ann-detail-meta">
          <el-tag size="small" type="warning">公告通知</el-tag>
          <span>{{ currentAnnouncement?.createTime }}</span>
        </div>
        <el-divider />
        <div class="ann-detail-content">{{ currentAnnouncement?.content }}</div>
      </div>
    </el-dialog>

    <!-- 服务优势 -->
    <div class="section advantages-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="title-icon"></span>我们的优势
        </h2>
      </div>
      <div class="advantages-grid">
        <div v-for="adv in advantages" :key="adv.title" class="adv-card">
          <div class="adv-img-wrap">
            <img :src="adv.img" :alt="adv.title" loading="lazy" @error="handleImageError" />
          </div>
          <div class="adv-body">
            <h4>{{ adv.title }}</h4>
            <p>{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { getFrontRooms, getAnnouncements, getPublicStats } from '@/api'
import { Search, ArrowRight, House, User, Key, Check, Location, Bell } from '@element-plus/icons-vue'

const router = useRouter()
const searchKey = ref('')
const roomsData = ref([])
const announcementsData = ref([])
const statsData = ref({ totalRooms: 0, availableRooms: 0, totalTenants: 0, rentedRooms: 0 })
const announcementVisible = ref(false)
const currentAnnouncement = ref(null)

const currentSlide = ref(0)
let slideTimer = null

const bannerSlides = [
  { img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1400&h=500&fit=crop' },
  { img: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=1400&h=500&fit=crop' },
  { img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&h=500&fit=crop' },
]

const hotTags = ['单间', '一室一厅', 'LOFT', '两室一厅']

onMounted(async () => {
  const [roomsRes, annRes, statsRes] = await Promise.all([
    getFrontRooms(),
    getAnnouncements(),
    getPublicStats()
  ])
  roomsData.value = roomsRes.data.map(r => ({ ...r, id: r.house_id }))
  announcementsData.value = annRes.data.map(a => ({ ...a, id: a.announcement_id, createTime: a.create_time }))
  statsData.value = statsRes.data

  slideTimer = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % bannerSlides.length
  }, 5000)
})

onBeforeUnmount(() => {
  if (slideTimer) clearInterval(slideTimer)
})

const statItems = computed(() => [
  { label: '房源总数', value: statsData.value.totalRooms, icon: House, bg: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { label: '可租房源', value: statsData.value.availableRooms, icon: Key, bg: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
  { label: '注册用户', value: statsData.value.totalTenants, icon: User, bg: 'linear-gradient(135deg, #fa709a, #fee140)' },
  { label: '已租房源', value: statsData.value.rentedRooms, icon: Check, bg: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
])

const featuredRooms = computed(() => roomsData.value.filter(r => r.status === 'available').slice(0, 9))

const advantages = [
  {
    title: '实名认证',
    desc: '接入第三方实名认证，自动核验身份和年龄，保障社区安全',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
  },
  {
    title: '在线签约',
    desc: '订单确认后自动生成电子合同，在线签署，方便快捷',
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop'
  },
  {
    title: '便捷缴费',
    desc: '支持支付宝、微信等多种支付方式，在线缴纳租金和水电费',
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop'
  },
  {
    title: '快速响应',
    desc: '7x24小时客服在线，报修需求快速响应，住得更安心',
    img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'
  },
]

function statusType(s) {
  return { available: 'success', reserved: 'warning', rented: 'danger' }[s] || 'info'
}
function statusLabel(s) {
  return { available: '可租', reserved: '已预订', rented: '已租' }[s] || s
}

function handleSearch() {
  if (searchKey.value.trim()) {
    router.push({ path: '/rooms', query: { keyword: searchKey.value.trim() } })
  } else {
    router.push('/rooms')
  }
}

function openAnnouncement(notice) {
  currentAnnouncement.value = notice
  announcementVisible.value = true
}

function handleImageError(e) {
  e.target.src = '/images/room-placeholder.svg'
}
</script>

<style scoped>
.home-page {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}

/* ===== Banner ===== */
.banner {
  position: relative;
  height: 420px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 48px;
}

.banner-slides {
  position: absolute;
  inset: 0;
}

.banner-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.2s ease-in-out;
}

.banner-slide.active {
  opacity: 1;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(30, 47, 95, 0.75) 0%, rgba(79, 56, 150, 0.55) 50%, rgba(30, 47, 95, 0.7) 100%);
  z-index: 1;
}

.banner-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  padding: 0 20px;
}

.banner-title {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 10px;
  letter-spacing: 2px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
  font-size: 18px;
  margin-bottom: 32px;
  opacity: 0.92;
  letter-spacing: 1px;
}

.banner-search {
  display: flex;
  gap: 12px;
  width: 560px;
  max-width: 90%;
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 4px 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.hot-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
}

.hot-label {
  font-size: 13px;
  opacity: 0.75;
}

.hot-tag {
  cursor: pointer;
  transition: all 0.2s;
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.hot-tag:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.6);
}

.banner-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  background: #fff;
  width: 28px;
  border-radius: 5px;
}

/* ===== Stats ===== */
.stats-section {
  margin-bottom: 48px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 18px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-value {
  font-size: 30px;
  font-weight: 800;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

/* ===== Section ===== */
.section {
  margin-bottom: 52px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  display: inline-block;
  width: 4px;
  height: 22px;
  background: linear-gradient(180deg, #409EFF, #667eea);
  border-radius: 2px;
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
  height: 200px;
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
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.4));
  pointer-events: none;
}

.room-status {
  position: absolute;
  top: 12px;
  right: 12px;
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
  font-size: 16px;
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
  font-size: 24px;
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

/* ===== Announcements ===== */
.announcements-grid {
  display: grid;
  gap: 12px;
}

.announcement-card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.04);
}

.announcement-card:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background: #f8faff;
}

.ann-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #fdf6ec, #fef0e7);
  color: #E6A23C;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ann-content {
  flex: 1;
  min-width: 0;
}

.ann-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ann-preview {
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.ann-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  color: #c0c4cc;
}

.ann-date {
  font-size: 12px;
  color: #c0c4cc;
}

.announcement-detail .ann-detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #909399;
  font-size: 13px;
}

.ann-detail-content {
  font-size: 14px;
  line-height: 2;
  color: #606266;
  white-space: pre-wrap;
}

/* ===== Advantages ===== */
.advantages-section {
  margin-bottom: 40px;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.adv-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.adv-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.adv-img-wrap {
  height: 180px;
  overflow: hidden;
}

.adv-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.adv-card:hover .adv-img-wrap img {
  transform: scale(1.08);
}

.adv-body {
  padding: 20px;
}

.adv-body h4 {
  font-size: 17px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}

.adv-body p {
  font-size: 13px;
  color: #909399;
  line-height: 1.7;
  margin: 0;
}
</style>
