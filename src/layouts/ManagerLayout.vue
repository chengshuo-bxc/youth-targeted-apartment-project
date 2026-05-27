<template>
  <el-container class="manager-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="aside-header" @click="isCollapse = !isCollapse">
        <el-icon :size="24" color="#E6A23C"><OfficeBuilding /></el-icon>
        <span v-show="!isCollapse" class="logo-text">管家工作台</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        router
        :collapse="isCollapse"
        class="aside-menu"
        background-color="#5D4037"
        text-color="#D7CCC8"
        active-text-color="#E6A23C"
      >
        <el-menu-item index="/manager/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>工作概览</template>
        </el-menu-item>
        <el-menu-item index="/manager/profile">
          <el-icon><User /></el-icon>
          <template #title>我的信息</template>
        </el-menu-item>
        <el-menu-item index="/manager/rooms">
          <el-icon><House /></el-icon>
          <template #title>房源管理</template>
        </el-menu-item>
        <el-menu-item index="/manager/orders">
          <el-icon><List /></el-icon>
          <template #title>订单审核</template>
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
          <el-tag type="warning" effect="dark">管家</el-tag>
          <el-tag type="warning" effect="plain">{{ userStore.userInfo?.area || '未分配区域' }}</el-tag>
          <span class="user-name">{{ userStore.userName }}</span>
          <el-button text @click="$router.push('/')">
            <el-icon><HomeFilled /></el-icon> 访问前台
          </el-button>
          <el-button text type="danger" @click="handleLogout">
            <el-icon><SwitchButton /></el-icon> 退出
          </el-button>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="manager-main">
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
  OfficeBuilding, DataAnalysis, House, List, User,
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
.manager-layout {
  min-height: 100vh;
}

.aside {
  background: #5D4037;
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

.user-name {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.manager-main {
  background: #f5f7fa;
  padding: 20px;
}
</style>
