<template>
  <div class="announcement-page">
    <!-- Banner -->
    <div class="page-banner">
      <div class="page-banner-overlay"></div>
      <div class="page-banner-content">
        <h1>公告中心</h1>
        <p>了解青年公寓最新动态和重要通知</p>
      </div>
    </div>

    <!-- 公告列表 -->
    <div v-if="announcements.length > 0" class="ann-list">
      <div
        v-for="item in announcements"
        :key="item.id"
        class="ann-card"
        @click="openDetail(item)"
      >
        <div class="ann-date-box">
          <div class="date-day">{{ formatDay(item.createTime) }}</div>
          <div class="date-ym">{{ formatYM(item.createTime) }}</div>
        </div>
        <div class="ann-body">
          <h3 class="ann-title">{{ item.title }}</h3>
          <p class="ann-preview">{{ (item.content || '').slice(0, 150) }}...</p>
        </div>
        <div class="ann-action">
          <el-icon><ArrowRight /></el-icon>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无公告" />

    <!-- 详情弹窗 -->
    <el-dialog v-model="detailVisible" :title="currentItem?.title" width="660px" top="8vh">
      <div class="detail-meta">
        <el-tag size="small" type="warning" effect="plain">公告通知</el-tag>
        <span class="detail-time">{{ currentItem?.createTime }}</span>
      </div>
      <el-divider />
      <div class="detail-content">{{ currentItem?.content }}</div>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAnnouncements } from '@/api'
import { ArrowRight } from '@element-plus/icons-vue'

const announcements = ref([])
const detailVisible = ref(false)
const currentItem = ref(null)

onMounted(async () => {
  const res = await getAnnouncements()
  announcements.value = res.data.map(a => ({ ...a, id: a.announcement_id, createTime: a.create_time }))
})

function formatDay(dt) {
  if (!dt) return '--'
  return dt.slice(8, 10)
}
function formatYM(dt) {
  if (!dt) return ''
  return dt.slice(0, 7).replace('-', '年') + '月'
}

function openDetail(item) {
  currentItem.value = item
  detailVisible.value = true
}
</script>

<style scoped>
.announcement-page {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}

.page-banner {
  position: relative;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;
  background: url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&h=300&fit=crop') center/cover;
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
}

.page-banner-content p {
  font-size: 15px;
  opacity: 0.9;
}

.ann-list {
  display: grid;
  gap: 16px;
}

.ann-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.ann-card:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.ann-date-box {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.date-day {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}

.date-ym {
  font-size: 11px;
  opacity: 0.85;
  margin-top: 4px;
}

.ann-body {
  flex: 1;
  min-width: 0;
}

.ann-title {
  font-size: 17px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.ann-preview {
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ann-action {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c4cc;
  transition: all 0.2s;
}

.ann-card:hover .ann-action {
  background: #409EFF;
  color: #fff;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-time {
  font-size: 13px;
  color: #909399;
}

.detail-content {
  font-size: 15px;
  line-height: 2;
  color: #606266;
  white-space: pre-wrap;
}
</style>
