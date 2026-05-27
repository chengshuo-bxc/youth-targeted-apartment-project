<template>
  <div class="auth-container">
    <div class="auth-page">
      <!-- 左侧：品牌介绍 -->
      <div class="auth-left">
        <div class="brand-section">
          <div class="brand-logo">
            <el-icon :size="48" color="#fff"><OfficeBuilding /></el-icon>
            <span class="brand-name">青年公寓</span>
          </div>
          <h1 class="brand-title">加入青年公寓</h1>
          <p class="brand-desc">开启舒适租房之旅，找到你的理想居所</p>
        </div>

        <div class="feature-list">
          <div class="feature-item">
            <div class="feature-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">
              <el-icon :size="24" color="#fff"><HomeFilled /></el-icon>
            </div>
            <div class="feature-text">
              <h4>优质房源</h4>
              <p>精选市区优质房源，拎包入住</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon" style="background: linear-gradient(135deg, #f093fb, #f5576c);">
              <el-icon :size="24" color="#fff"><Lock /></el-icon>
            </div>
            <div class="feature-text">
              <h4>安全保障</h4>
              <p>实名认证，合同保障，安心租住</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon" style="background: linear-gradient(135deg, #4facfe, #00f2fe);">
              <el-icon :size="24" color="#fff"><Headset /></el-icon>
            </div>
            <div class="feature-text">
              <h4>贴心服务</h4>
              <p>24小时管家服务，快速响应</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：登录表单 -->
      <div class="auth-right">
        <div class="auth-form-wrapper">
          <h2 class="form-title">欢迎登录</h2>
          <p class="form-subtitle">请输入您的账号密码</p>

          <el-form :model="form" :rules="rules" ref="formRef" class="auth-form">
            <el-form-item prop="username">
              <div class="form-label">用户名</div>
              <el-input 
                v-model="form.username" 
                placeholder="请输入用户名" 
                size="large"
                :prefix-icon="User"
              />
            </el-form-item>

            <el-form-item prop="password">
              <div class="form-label">密码</div>
              <el-input 
                v-model="form.password" 
                type="password" 
                placeholder="请输入密码" 
                size="large"
                :prefix-icon="Lock"
                show-password
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                class="submit-btn"
                @click="handleLogin" 
                :loading="loading"
              >
                <el-icon><UserFilled /></el-icon>
                立即登录
              </el-button>
            </el-form-item>
          </el-form>

          <div class="form-footer">
            <span>还没有账号？</span>
            <router-link to="/register" class="link-btn">立即注册</router-link>
          </div>

          <el-divider>演示账号</el-divider>
          <div class="demo-accounts">
            <el-button size="small" @click="fillDemo('tenant')">租客登录</el-button>
            <el-button size="small" type="warning" @click="fillDemo('manager')">管家登录</el-button>
            <el-button size="small" type="primary" @click="fillDemo('admin')">管理员登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock, OfficeBuilding, HomeFilled, Headset, UserFilled } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const demoAccounts = {
  tenant: { username: 'zhangsan', password: '123456' },
  manager: { username: 'guanjia_a', password: '123456' },
  admin: { username: 'admin', password: '123456' }
}

function fillDemo(type) {
  const demo = demoAccounts[type]
  form.username = demo.username
  form.password = demo.password
}

async function handleLogin() {
  formRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      const res = await userStore.login(form)
      if (res.code === 200) {
        ElMessage.success('登录成功')
        const role = res.data.user.role_type
        // 用 setTimeout 确保状态写入后再跳转
        setTimeout(() => {
          if (role === 'admin') {
            router.push('/admin/dashboard')
          } else if (role === 'manager') {
            router.replace('/manager/dashboard')
          } else {
            router.push('/')
          }
        }, 100)
      } else {
        ElMessage.error(res.message || '登录失败')
      }
    } catch (e) {
      ElMessage.error(e?.message || e.response?.data?.message || '登录失败，请检查用户名和密码')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.auth-container {
  padding: 24px;
  display: flex;
  justify-content: center;
  min-height: calc(100vh - 68px);
  box-sizing: border-box;
  width: 100%;
}

.auth-page {
  width: 100%;
  max-width: 1800px;
  min-height: calc(100vh - 200px);
  display: flex;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

/* ===== 左侧品牌区 ===== */
.auth-left {
  flex: 1;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.auth-left::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -30%;
  width: 80%;
  height: 150%;
  background: rgba(255, 255, 255, 0.03);
  transform: rotate(-15deg);
  pointer-events: none;
}

.brand-section {
  margin-bottom: 50px;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}

.brand-name {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
}

.brand-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 14px;
  line-height: 1.2;
}

.brand-desc {
  font-size: 16px;
  opacity: 0.85;
  line-height: 1.6;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s, background 0.3s;
}

.feature-item:hover {
  transform: translateX(6px);
  background: rgba(255, 255, 255, 0.12);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-text h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.feature-text p {
  font-size: 13px;
  opacity: 0.75;
  margin: 0;
}

/* ===== 右侧表单区 ===== */
.auth-right {
  flex: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 380px;
}

.form-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  text-align: center;
}

.form-subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
  text-align: center;
}

.auth-form {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
  padding: 4px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e4e7ed;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409EFF;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #409EFF;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

:deep(.el-input__inner) {
  height: 44px;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(102, 126, 234, 0.4);
}

.form-footer {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.form-footer span {
  margin-right: 6px;
}

.link-btn {
  color: #409EFF;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
}

.link-btn:hover {
  text-decoration: underline;
}

:deep(.el-divider__text) {
  color: #999;
  font-size: 13px;
}

.demo-accounts {
  display: flex;
  justify-content: center;
  gap: 14px;
}

.demo-accounts .el-button {
  border-radius: 8px;
}

/* 响应式 */
@media (max-width: 900px) {
  .auth-page {
    flex-direction: column;
  }
  
  .auth-left {
    padding: 40px 30px;
  }
  
  .brand-title {
    font-size: 28px;
  }
  
  .auth-right {
    padding: 30px;
  }
}

@media (max-width: 600px) {
  .auth-left {
    display: none;
  }
  
  .auth-page {
    border-radius: 16px;
  }
}
</style>