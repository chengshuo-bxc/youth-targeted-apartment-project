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
          <h1 class="brand-title">开启舒适租房之旅</h1>
          <p class="brand-desc">注册账号，享受便捷的租房服务</p>
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

      <!-- 右侧：注册表单 -->
      <div class="auth-right">
        <div class="auth-form-wrapper">
          <h2 class="form-title">创建新账号</h2>
          <p class="form-subtitle">填写以下信息完成注册</p>

          <el-form :model="form" :rules="rules" ref="formRef" class="auth-form">
            <el-row :gutter="14">
              <el-col :span="12">
                <el-form-item prop="username">
                  <div class="form-label">用户名 <span class="required">*</span></div>
                  <el-input 
                    v-model="form.username" 
                    placeholder="用于登录" 
                    size="large"
                    :prefix-icon="User"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="name">
                  <div class="form-label">真实姓名 <span class="required">*</span></div>
                  <el-input 
                    v-model="form.name" 
                    placeholder="请输入真实姓名" 
                    size="large"
                    :prefix-icon="UserFilled"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item prop="phone">
              <div class="form-label">手机号 <span class="required">*</span></div>
              <el-input 
                v-model="form.phone" 
                placeholder="请输入手机号" 
                size="large"
                :prefix-icon="Phone"
              />
            </el-form-item>

            <el-row :gutter="14">
              <el-col :span="12">
                <el-form-item prop="idCard">
                  <div class="form-label">身份证号</div>
                  <el-input 
                    v-model="form.idCard" 
                    placeholder="选填" 
                    size="large"
                    :prefix-icon="Postcard"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="gender">
                  <div class="form-label">性别</div>
                  <el-select v-model="form.gender" size="large" style="width: 100%;" placeholder="请选择">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="14">
              <el-col :span="12">
                <el-form-item prop="password">
                  <div class="form-label">密码 <span class="required">*</span></div>
                  <el-input 
                    v-model="form.password" 
                    type="password" 
                    placeholder="请输入密码" 
                    size="large"
                    :prefix-icon="Lock"
                    show-password
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="confirmPassword">
                  <div class="form-label">确认密码 <span class="required">*</span></div>
                  <el-input 
                    v-model="form.confirmPassword" 
                    type="password" 
                    placeholder="请再次输入密码" 
                    size="large"
                    :prefix-icon="Lock"
                    show-password
                    @keyup.enter="handleRegister"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-button 
                type="primary" 
                size="large" 
                class="submit-btn"
                @click="handleRegister" 
                :loading="loading"
              >
                <el-icon><UserFilled /></el-icon>
                立即注册
              </el-button>
            </el-form-item>
          </el-form>

          <div class="form-footer">
            <span>已有账号？</span>
            <router-link to="/login" class="link-btn">立即登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api'
import { ElMessage } from 'element-plus'
import { User, Lock, Phone, Postcard, OfficeBuilding, HomeFilled, Headset, UserFilled } from '@element-plus/icons-vue'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  name: '',
  phone: '',
  idCard: '',
  gender: '男',
  password: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度3-20位', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字和下划线', trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

async function handleRegister() {
  formRef.value.validate(async valid => {
    if (!valid) return
    loading.value = true
    try {
      const res = await register({
        username: form.username,
        name: form.name,
        phone: form.phone,
        id_card: form.idCard,
        gender: form.gender,
        password: form.password
      })
      if (res.code === 200) {
        ElMessage.success('注册成功，请登录')
        router.push('/login')
      } else {
        ElMessage.error(res.message || '注册失败')
      }
    } catch (e) {
      ElMessage.error(e.response?.data?.message || '注册失败')
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
  overflow-y: auto;
}

.auth-form-wrapper {
  width: 100%;
  max-width: 480px;
  padding: 10px 0;
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
  margin-bottom: 28px;
  text-align: center;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.required {
  color: #F56C6C;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  border-radius: 10px;
  padding: 2px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e4e7ed;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover) {
  border-color: #409EFF;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #409EFF;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.1);
}

:deep(.el-input__inner) {
  height: 42px;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  height: 48px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
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
  margin-top: 20px;
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