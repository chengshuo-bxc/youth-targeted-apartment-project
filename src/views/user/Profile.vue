<template>
  <div class="profile-page">
    <h2 class="section-title">个人信息</h2>
    <el-card>
      <div class="profile-header">
        <el-avatar :size="80" :icon="UserFilled" />
        <div class="profile-basic">
          <h3>{{ userStore.userName }}</h3>
          <el-tag :type="roleType">{{ roleLabel }}</el-tag>
        </div>
      </div>
      <el-divider />
      <el-form :model="form" label-width="100px" class="profile-form">
        <el-form-item label="用户ID">
          <el-input :model-value="userStore.userInfo?.id" disabled />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.gender">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.idCard" disabled>
            <template #append>
              <el-tag size="small" type="success">已认证</el-tag>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input :model-value="form.age + '岁'" disabled>
            <template #append>
              <el-tag size="small" type="success">已核验</el-tag>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">保存修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { getUserInfo } from '@/api'
import { UserFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()

const form = reactive({
  name: userStore.userInfo?.name || '',
  gender: userStore.userInfo?.gender || '男',
  phone: userStore.userInfo?.phone || '',
  idCard: '410***********1234',
  age: userStore.userInfo?.age || 22
})

async function loadProfile() {
  try {
    const { data } = await getUserInfo()
    if (data) {
      Object.assign(form, {
        name: data.name || form.name,
        gender: data.gender || form.gender,
        phone: data.phone || form.phone,
        idCard: data.idCard || form.idCard,
        age: data.age || form.age
      })
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(loadProfile)

const roleLabel = computed(() => {
  const map = { admin: '管理员', manager: '管家', tenant: '租客' }
  return map[userStore.userRole] || '用户'
})

const roleType = computed(() => {
  const map = { admin: 'danger', manager: 'warning', tenant: '' }
  return map[userStore.userRole] || 'info'
})

function handleSave() {
  userStore.login({
    ...userStore.userInfo,
    name: form.name,
    phone: form.phone,
    gender: form.gender
  })
  ElMessage.success('信息修改成功')
}
</script>

<style scoped>
.profile-page {
  max-width: 1800px;
  width: 100%;
  box-sizing: border-box;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-basic h3 {
  font-size: 20px;
  color: #303133;
  margin-bottom: 6px;
}

.profile-form {
  max-width: 500px;
  margin-top: 16px;
}
</style>
