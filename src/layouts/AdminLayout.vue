<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="aside-header" @click="isCollapse = !isCollapse">
        <el-icon :size="24" color="#409EFF"><OfficeBuilding /></el-icon>
        <span v-show="!isCollapse" class="logo-text">后台管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        :collapse="isCollapse"
        class="aside-menu"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/admin/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>数据概览</template>
        </el-menu-item>
        <el-menu-item index="/admin/rooms">
          <el-icon><House /></el-icon>
          <template #title>房源管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/orders">
          <el-icon><List /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/contracts">
          <el-icon><DocumentCopy /></el-icon>
          <template #title>合同管理</template>
        </el-menu-item>
        <el-menu-item index="/admin/payments">
          <el-icon><Wallet /></el-icon>
          <template #title>缴费管理</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧区域 -->
    <el-container class="right-container">
      <!-- 顶栏 -->
      <el-header class="top-bar">
        <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
          <Fold v-if="!isCollapse" />
          <Expand v-else />
        </el-icon>
        <div class="top-bar-right">
          <el-tag type="success" effect="dark">管理员</el-tag>
          <el-button text @click="$router.push('/')">
            <el-icon><HomeFilled /></el-icon> 访问前台
          </el-button>
          <el-button text type="danger" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon> 退出
          </el-button>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  OfficeBuilding, DataAnalysis, House, User, List, DocumentCopy, Wallet,
  Fold, Expand, HomeFilled, SwitchButton
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isCollapse = ref(false)

const activeMenu = computed(() => route.path)

function handleLogout() {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
}

.aside {
  background: #304156;
  transition: width 0.3s;
  overflow: hidden;
}

.aside-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.aside-menu {
  border-right: none;
}

.right-container {
  flex-direction: column;
}

.top-bar {
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
  height: 64px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-main {
  background: #f5f7fa;
  padding: 20px;
}
</style>
