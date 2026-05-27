<template>
  <div class="room-detail-page" v-if="room">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/rooms' }">房源列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ room.title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="24" class="detail-content">
      <!-- 左侧：图片和详情 -->
      <el-col :span="16">
        <!-- 图片轮播 -->
        <el-carousel :interval="3000" height="400px" class="room-carousel">
          <el-carousel-item v-for="(img, i) in room.images" :key="i">
            <img :src="img" class="carousel-img" @error="handleImageError" />
          </el-carousel-item>
        </el-carousel>

        <!-- 房源信息 -->
        <el-card class="info-card" shadow="never">
          <div class="room-header">
            <h2>{{ room.title }}</h2>
            <el-tag :type="statusType(room.status)" size="large" effect="dark">
              {{ statusLabel(room.status) }}
            </el-tag>
          </div>
          <div class="room-tags">
            <el-tag v-for="tag in room.tags" :key="tag" effect="plain">{{ tag }}</el-tag>
          </div>
          <div class="room-price-box">
            <span class="price-num">¥{{ room.price }}</span>
            <span class="price-unit">/月</span>
            <span class="deposit">押金：¥{{ room.deposit }}</span>
          </div>
          <el-divider />
          <div class="room-props">
            <div class="prop-item"><el-icon><House /></el-icon><span>房型：{{ room.type }}</span></div>
            <div class="prop-item"><el-icon><Ruler /></el-icon><span>面积：{{ room.area }}m²</span></div>
            <div class="prop-item"><el-icon><OfficeBuilding /></el-icon><span>楼层：{{ room.floor }}</span></div>
            <div class="prop-item"><el-icon><Location /></el-icon><span>地址：{{ room.address }}</span></div>
          </div>
          <el-divider />
          <h3>房源描述</h3>
          <p class="description">{{ room.description }}</p>
        </el-card>
      </el-col>

      <!-- 右侧：预订卡片 -->
      <el-col :span="8">
        <div class="right-sidebar">
          <el-card class="booking-card" shadow="never">
            <h3>预约看房</h3>
            <el-form :model="bookingForm" label-width="80px" class="booking-form">
              <el-form-item label="姓名">
                <el-input v-model="bookingForm.name" placeholder="请输入您的姓名" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="bookingForm.phone" placeholder="请输入联系电话" />
              </el-form-item>
              <el-form-item label="入住日期">
                <el-date-picker v-model="bookingForm.date" type="date" placeholder="选择入住日期" style="width: 100%" />
              </el-form-item>
              <el-form-item label="退租日期">
                <el-date-picker v-model="bookingForm.checkOut" type="date" placeholder="预计退租日期（选填）" style="width: 100%" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="bookingForm.remark" type="textarea" :rows="3" placeholder="其他需求（选填）" />
              </el-form-item>
              <el-button
                type="primary"
                size="large"
                style="width: 100%"
                :disabled="room.status !== 'available'"
                @click="handleBooking"
              >
                {{ room.status === 'available' ? '立即预约' : '暂不可预约' }}
              </el-button>
            </el-form>
          </el-card>

          <!-- 设施列表 -->
          <el-card class="facility-card" shadow="never">
            <h3>配套设施</h3>
            <div class="facility-list">
              <el-tag v-for="f in room.facilities" :key="f" effect="plain" round class="facility-tag">
                <el-icon><Check /></el-icon> {{ f }}
              </el-tag>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-empty v-else description="房源不存在" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getRoomDetail, createOrder } from '@/api'
import { House, OfficeBuilding, Location, Check } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const room = ref(null)

onMounted(async () => {
  const res = await getRoomDetail(route.params.id)
  const data = res.data
  room.value = { ...data, id: data.house_id }
})

const bookingForm = ref({
  name: '',
  phone: '',
  date: '',
  checkOut: '',
  remark: ''
})

function statusType(s) {
  return { available: 'success', reserved: 'warning', rented: 'danger' }[s] || 'info'
}
function statusLabel(s) {
  return { available: '可租', reserved: '已预订', rented: '已租' }[s] || s
}

async function handleBooking() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录后再预约')
    router.push('/login')
    return
  }
  if (!bookingForm.value.name || !bookingForm.value.phone || !bookingForm.value.date) {
    ElMessage.warning('请填写完整的预约信息')
    return
  }
  try {
    // 将日期格式化为 YYYY-MM-DD
    const checkInDate = new Date(bookingForm.value.date).toISOString().slice(0, 10)
    await createOrder({
      house_id: room.value.id,
      type: '预订',
      check_in: checkInDate,
      remark: `预约人：${bookingForm.value.name}，电话：${bookingForm.value.phone}${bookingForm.value.remark ? '，' + bookingForm.value.remark : ''}`
    })
    ElMessage.success('预约成功！请等待管理员审核')
    bookingForm.value = { name: '', phone: '', date: '', remark: '' }
  } catch (e) {
    ElMessage.error('预约失败，请稍后重试')
  }
}

function handleImageError(e) {
  e.target.src = '/images/room-placeholder.svg'
}
</script>

<style scoped>
.room-detail-page {
  padding: 24px;
  max-width: 1800px;
  margin: 0 auto;
  box-sizing: border-box;
  width: 100%;
}

.el-breadcrumb {
  margin-bottom: 20px;
}

.detail-content {
  margin-top: 8px;
}

.room-carousel {
  border-radius: 12px;
  overflow: hidden;
}

.carousel-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.info-card {
  margin-top: 20px;
  border-radius: 12px;
}

.room-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.room-header h2 {
  font-size: 22px;
  color: #303133;
}

.room-tags {
  display: flex;
  gap: 8px;
  margin: 12px 0;
  flex-wrap: wrap;
}

.room-price-box {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-num {
  font-size: 32px;
  font-weight: 700;
  color: #F56C6C;
}

.price-unit {
  font-size: 14px;
  color: #909399;
}

.deposit {
  margin-left: 16px;
  font-size: 14px;
  color: #909399;
}

.room-props {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.prop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}

.prop-item .el-icon {
  color: #409EFF;
}

.description {
  color: #606266;
  line-height: 1.8;
  font-size: 14px;
}

.right-sidebar {
  position: sticky;
  top: 84px;
}

.booking-card {
  border-radius: 12px;
}

.booking-card h3 {
  font-size: 18px;
  margin-bottom: 20px;
}

.booking-form {
  margin-top: 16px;
}

.facility-card {
  border-radius: 12px;
  margin-top: 20px;
}

.facility-card h3 {
  font-size: 16px;
  margin-bottom: 12px;
}

.facility-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.facility-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
