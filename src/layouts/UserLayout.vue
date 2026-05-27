<template>
  <el-container class="user-layout">
    <!-- 左侧菜单 -->
    <el-aside width="220px" class="aside">
      <div class="aside-header">
        <el-icon :size="24" color="#409EFF"><User /></el-icon>
        <span>个人中心</span>
      </div>
      <el-menu :default-active="activeMenu" router class="aside-menu">
        <el-menu-item index="/user/profile">
          <el-icon><UserFilled /></el-icon>
          <span>个人信息</span>
        </el-menu-item>
        <el-menu-item index="/user/orders">
          <el-icon><Document /></el-icon>
          <span>我的订单</span>
        </el-menu-item>
        <el-menu-item index="/user/contracts">
          <el-icon><DocumentCopy /></el-icon>
          <span>我的合同</span>
        </el-menu-item>
        <el-menu-item index="/user/payments">
          <el-icon><Wallet /></el-icon>
          <span>缴费记录</span>
        </el-menu-item>
        <el-menu-item index="/" class="menu-back">
          <el-icon><Back /></el-icon>
          <span>返回首页</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧内容 -->
    <el-main class="main-area">
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { User, UserFilled, Document, DocumentCopy, Wallet, Back } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.user-layout {
  min-height: 100vh;
  background: #f5f7fa;
}

.aside {
  background: #fff;
  border-right: 1px solid #e4e7ed;
  overflow-y: auto;
}

.aside-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #e4e7ed;
}

.aside-menu {
  border-right: none;
}

.menu-back {
  margin-top: 20px;
  border-top: 1px solid #e4e7ed;
}

.main-area {
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}
</style>
