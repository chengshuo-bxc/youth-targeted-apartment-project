<template>
  <div class="manager-profile">
    <h2 class="section-title">管家信息</h2>
    <el-card>
      <!-- 管家头部信息 -->
      <div class="profile-header">
        <div class="avatar-wrapper">
          <el-avatar :size="90" :icon="UserFilled" style="background:linear-gradient(135deg,#E6A23C,#F56C6C);" />
          <el-badge :value="'管家'" type="warning" class="role-badge" />
        </div>
        <div class="profile-basic">
          <h3>{{ userStore.userName || '-' }}</h3>
          <p class="username">@{{ userStore.userInfo?.username || '-' }}</p>
          <div class="info-tags">
            <el-tag type="warning" effect="dark" size="large">管家</el-tag>
            <el-tag v-if="userStore.userInfo?.area" type="primary" size="large">
              <el-icon><Location /></el-icon> {{ userStore.userInfo.area }}
            </el-tag>
            <el-tag v-else type="info" size="large">未分配区域</el-tag>
          </div>
        </div>
      </div>

      <el-divider />

      <!-- 详细信息 -->
      <el-form label-width="110px" class="profile-form">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="用户ID">
              <el-input :model-value="userStore.userInfo?.id ?? '-'" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名">
              <el-input :model-value="userStore.userName ?? '-'" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input :model-value="userStore.userInfo?.phone ?? '-'" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-input :model-value="userStore.userInfo?.gender ?? '-'" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="负责区域">
              <el-input :model-value="userStore.userInfo?.area || '未分配'" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色权限">
              <el-input model-value="管家（房源管理+订单审核）" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 工作概览 -->
    <el-card style="margin-top:20px;" v-loading="loadingStats">
      <template #header><strong>我的工作概览</strong></template>
      <el-descriptions :column="4" border>
        <el-descriptions-item label="管理房源">{{ stats.totalRooms }} 套</el-descriptions-item>
        <el-descriptions-item label="可租房源"><span style="color:#67C23A;font-weight:600;">{{ stats.availableRooms }} 套</span></el-descriptions-item>
        <el-descriptions-item label="待审核订单"><span style="color:#E6A23C;font-weight:600;">{{ stats.pendingOrders }} 单</span></el-descriptions-item>
        <el-descriptions-item label="在租客户"><span style="color:#409EFF;font-weight:600;">{{ stats.activeTenants }} 人</span></el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 提示 -->
    <el-alert title="如需修改个人信息或分配区域变化，请联系管理员。" type="info" :closable="false" show-icon style="margin-top:16px;" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getRoomList, getOrderList } from '@/api'
import { UserFilled, Location } from '@element-plus/icons-vue'

const userStore = useUserStore()
const loadingStats = ref(false)
const stats = reactive({ totalRooms: '-', availableRows: '-', pendingOrders: '-', activeTenants: '-' })

async function loadStats() {
  loadingStats.value = true
  try {
    const [roomsRes, ordersRes] = await Promise.all([getRoomList(), getOrderList()])
    const rooms = roomsRes.data || []
    const orders = ordersRes.data || []
    stats.totalRooms = rooms.length
    stats.availableRooms = rooms.filter(r => r.status === 'available').length
    stats.pendingOrders = orders.filter(o => o.status === 'pending').length
    stats.activeTenants = [...new Set(orders.filter(o => o.status === 'active').map(o => o.user_id))].length
  } catch (e) { console.error(e) }
  loadingStats.value = false
}

onMounted(loadStats)
</script>

<style scoped>
.manager-profile {
  max-width: 1800px;
  width: 100%;
  box-sizing: border-box;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 28px;
}

.avatar-wrapper {
  position: relative;
}
.role-badge {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
}

.profile-basic h3 {
  font-size: 22px;
  color: #303133;
  margin-bottom: 4px;
}
.username {
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}
.info-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.info-tags .el-icon {
  margin-right: 2px;
  vertical-align: middle;
}

.profile-form {
  max-width: 100%;
  margin-top: 8px;
}
</style>
