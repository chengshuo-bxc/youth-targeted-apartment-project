<template>
  <div class="user-manage">
    <h2 class="section-title">用户管理</h2>
    <el-card shadow="never">
      <div class="toolbar">
        <el-input v-model="keyword" placeholder="搜索用户名/手机号" clearable style="width: 240px;" prefix-icon="Search" />
        <el-select v-model="filterRole" placeholder="角色筛选" clearable style="width: 140px;">
          <el-option label="租客" value="tenant" />
          <el-option label="管家" value="manager" />
          <el-option label="管理员" value="admin" />
        </el-select>
        <el-button type="primary" @click="showAddManagerDialog">
          <el-icon><Plus /></el-icon> 添加管家
        </el-button>
      </div>

      <el-table :data="filteredUsers" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="gender" label="性别" width="70" />
        <el-table-column prop="age" label="年龄" width="70" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag size="small" :type="roleType(row.role)">{{ roleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="area" label="负责区域" width="140">
          <template #default="{ row }">
            <span v-if="row.area" style="color:#E6A23C;font-weight:500;">{{ row.area }}</span>
            <span v-else style="color:#c0c4cc;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '已禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="120" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.role === 'manager'" size="small" type="primary" text @click="editManager(row)">分配区域</el-button>
            <el-button size="small" type="primary" text @click="toggleStatus(row)">
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" text @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加管家对话框 -->
    <el-dialog v-model="addMgrDlgVis" title="添加管家账号" width="500px">
      <el-form :model="mgrForm" label-width="90px">
        <el-form-item label="姓名"><el-input v-model="mgrForm.name" placeholder="管家真实姓名" /></el-form-item>
        <el-form-item label="用户名"><el-input v-model="mgrForm.username" placeholder="登录用户名" /></el-form-item>
        <el-form-item label="密码"><el-input v-model="mgrForm.password" type="password" placeholder="初始密码" show-password /></el-form-item>
        <el-form-item label="手机号"><el-input v-model="mgrForm.phone" placeholder="手机号" /></el-form-item>
        <el-form-item label="负责区域">
          <el-select v-model="mgrForm.area" placeholder="选择负责区域" style="width:100%;">
            <el-option label="A区 - 1-3号楼" value="A区（1-3号楼）" />
            <el-option label="B区 - 4-6号楼" value="B区（4-6号楼）" />
            <el-option label="C区 - 7-9号楼" value="C区（7-9号楼）" />
            <el-option label="D区 - 10-12号楼" value="D区（10-12号楼）" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addMgrDlgVis = false">取消</el-button>
        <el-button type="primary" @click="submitAddManager">创建管家</el-button>
      </template>
    </el-dialog>

    <!-- 分配区域对话框 -->
    <el-dialog v-model="editDlgVis" title="分配/修改管家区域" width="400px">
      <p style="margin-bottom:12px;">管家：<strong>{{ editingUser?.name }}</strong></p>
      <el-select v-model="editArea" placeholder="选择负责区域" style="width:100%;">
        <el-option label="A区 - 1-3号楼" value="A区（1-3号楼）" />
        <el-option label="B区 - 4-6号楼" value="B区（4-6号楼）" />
        <el-option label="C区 - 7-9号楼" value="C区（7-9号楼）" />
        <el-option label="D区 - 10-12号楼" value="D区（10-12号楼）" />
      </el-select>
      <template #footer>
        <el-button @click="editDlgVis = false">取消</el-button>
        <el-button type="primary" @click="submitEditArea">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { getUserList, updateUserStatus, updateUser } from '@/api'
import { register } from '@/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

const keyword = ref('')
const filterRole = ref('')
const userList = ref([])

// 添加管家
const addMgrDlgVis = ref(false)
const mgrForm = reactive({ name:'', username:'', password:'123456', phone:'', area:'' })

// 编辑区域
const editDlgVis = ref(false)
const editingUser = ref(null)
const editArea = ref('')

async function loadUsers() {
  try {
    const { data } = await getUserList()
    userList.value = data.map(u => ({
      ...u,
      id: u.user_id ?? u.id,
      name: u.name ?? u.name,
      role: u.role_type ?? u.role,
      area: u.area ?? '',
      createTime: u.create_time ?? u.createTime,
    }))
  } catch (e) { console.error(e) }
}

const filteredUsers = computed(() => {
  let list = userList.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(u => (u.name||'').includes(kw) || (u.phone||'').includes(kw))
  }
  if (filterRole.value) list = list.filter(u => u.role === filterRole.value)
  return list
})

function roleType(r) { return { admin:'danger', manager:'warning', tenant:'' }[r] || 'info' }
function roleLabel(r) { return { admin:'管理员', manager:'管家', tenant:'租客' }[r] || r }

async function toggleStatus(row) {
  const newStatus = row.status === 'active' ? 'inactive' : 'active'
  try {
    await updateUserStatus(row.id, newStatus); row.status = newStatus
    ElMessage.success(`用户「${row.name}」已${newStatus==='active'?'启用':'禁用'}`)
  } catch(e){console.error(e)}
}
async function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除用户「${row.name}」吗？`,'删除确认',{type:'warning'})
    .then(async()=>{
      try{await updateUserStatus(row.id,'deleted'); userList.value=userList.value.filter(u=>u.id!==row.id);ElMessage.success('删除成功')}catch(e){console.error(e)}
    }).catch(()=>{})
}

// ====== 添加管家 ======
function showAddManagerDialog() {
  Object.assign(mgrForm, { name:'', username:'', password:'123456', phone:'', area:'' })
  addMgrDlgVis.value = true
}
async function submitAddManager() {
  if (!mgrForm.name || !mgrForm.username || !mgrForm.area) return ElMessage.warning('请填写完整信息')
  try {
    await register({ ...mgrForm, gender:'男' })
    // 注册成功后将角色改为管家并设置区域
    // 由于register默认是tenant，需要找到刚注册的用户并更新
    const { data } = await getUserList()
    const newUser = data.find(u => u.username === mgrForm.username && u.role_type === 'tenant')
    if (newUser) {
      await updateUser(newUser.user_id, { role_type: 'manager', area: mgrForm.area })
    }
    ElMessage.success(`管家「${mgrForm.name}」创建成功，密码：123456`)
    addMgrDlgVis.value = false
    loadUsers()
  } catch(e){ console.error(e) }
}

// ====== 分配区域 ======
function editManager(row) {
  editingUser.value = row; editArea.value = row.area || ''
  editDlgVis.value = true
}
async function submitEditArea() {
  try {
    await updateUser(editingUser.value.id, { area: editArea.value })
    editingUser.value.area = editArea.value
    ElMessage.success('区域已更新')
    editDlgVis.value = false
  } catch(e){ console.error(e) }
}

onMounted(() => loadUsers())
</script>

<style scoped>
.toolbar { display:flex;gap:12px;margin-bottom:16px;align-items:center; }
</style>
