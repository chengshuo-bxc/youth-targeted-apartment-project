<template>
  <div class="room-manage">
    <h2 class="section-title">房源管理</h2>
    <el-card shadow="never">
      <div class="toolbar">
        <div class="toolbar-left">
          <el-input v-model="keyword" placeholder="搜索房源名称" clearable style="width: 240px;" prefix-icon="Search" />
          <el-select v-model="filterStatus" placeholder="状态筛选" clearable style="width: 140px;">
            <el-option label="可租" value="available" />
            <el-option label="已预订" value="reserved" />
            <el-option label="已租" value="rented" />
          </el-select>
        </div>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon> 新增房源
        </el-button>
      </div>

      <el-table :data="pagedRooms" stripe border>
        <el-table-column prop="id" label="ID" width="60" />
        <el-table-column prop="title" label="房源名称" min-width="180" />
        <el-table-column prop="type" label="房型" width="100" />
        <el-table-column prop="area" label="面积(m²)" width="90" />
        <el-table-column prop="floor" label="楼层" width="80" />
        <el-table-column prop="price" label="月租(元)" width="100">
          <template #default="{ row }">
            <span style="color: #F56C6C; font-weight: 600;">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" text @click="showEditDialog(row)">编辑</el-button>
            <el-button size="small" type="warning" text @click="changeStatus(row)">变更状态</el-button>
            <el-button size="small" type="danger" text @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination background layout="total, prev, pager, next" :total="filteredRooms.length" v-model:current-page="currentPage" :page-size="pageSize" />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑房源' : '新增房源'" width="600px">
      <el-form :model="roomForm" label-width="100px">
        <el-form-item label="房源名称"><el-input v-model="roomForm.title" /></el-form-item>
        <el-form-item label="房型">
          <el-select v-model="roomForm.type" style="width: 100%;">
            <el-option v-for="t in ['单间','双人间','一室一厅','两室一厅','三室一厅','LOFT','床位']" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="面积(m²)"><el-input-number v-model="roomForm.area" :min="10" :max="200" /></el-form-item>
        <el-form-item label="楼层"><el-input v-model="roomForm.floor" placeholder="如：1层" /></el-form-item>
        <el-form-item label="月租(元)"><el-input-number v-model="roomForm.price" :min="100" :step="100" /></el-form-item>
        <el-form-item label="押金(元)"><el-input-number v-model="roomForm.deposit" :min="100" :step="100" /></el-form-item>
        <el-form-item label="地址"><el-input v-model="roomForm.address" /></el-form-item>
        <el-form-item label="描述"><el-input v-model="roomForm.description" type="textarea" :rows="3" /></el-form-item>
        <el-form-item label="标签">
          <el-select v-model="roomForm.tags" multiple filterable allow-create style="width: 100%;" placeholder="输入后回车添加">
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { getRoomList, addRoom, updateRoom, deleteRoom, changeRoomStatus } from '@/api'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { Plus, Search } from '@element-plus/icons-vue'

const keyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = 10
const dialogVisible = ref(false)
const isEdit = ref(false)
const editId = ref(null)

const roomList = ref([])

async function loadRooms() {
  try {
    const { data } = await getRoomList()
    roomList.value = data.map(r => ({
      ...r,
      id: r.house_id ?? r.id,
      createTime: r.create_time ?? r.createTime,
    }))
  } catch (e) {
    console.error('获取房源列表失败', e)
  }
}

const roomForm = reactive({
  title: '', type: '单间', area: 25, floor: '1层',
  price: 1000, deposit: 1000, address: '', description: '', tags: []
})

const filteredRooms = computed(() => {
  let list = roomList.value
  if (keyword.value) {
    const kw = keyword.value.toLowerCase()
    list = list.filter(r => r.title.toLowerCase().includes(kw) || r.address.toLowerCase().includes(kw))
  }
  if (filterStatus.value) list = list.filter(r => r.status === filterStatus.value)
  return list
})

const pagedRooms = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredRooms.value.slice(start, start + pageSize)
})

function statusType(s) {
  return { available: 'success', reserved: 'warning', rented: 'danger' }[s] || 'info'
}
function statusLabel(s) {
  return { available: '可租', reserved: '已预订', rented: '已租' }[s] || s
}

function showAddDialog() {
  isEdit.value = false
  editId.value = null
  Object.assign(roomForm, { title: '', type: '单间', area: 25, floor: '1层', price: 1000, deposit: 1000, address: '', description: '', tags: [] })
  dialogVisible.value = true
}

function showEditDialog(row) {
  isEdit.value = true
  editId.value = row.id
  Object.assign(roomForm, { title: row.title, type: row.type, area: row.area, floor: row.floor, price: row.price, deposit: row.deposit, address: row.address, description: row.description, tags: [...row.tags] })
  dialogVisible.value = true
}

async function handleSave() {
  try {
    if (isEdit.value) {
      await updateRoom(editId.value, roomForm)
      ElMessage.success('修改成功')
    } else {
      await addRoom(roomForm)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    await loadRooms()
  } catch (e) {
    console.error('保存房源失败', e)
  }
}

async function changeStatus(row) {
  const statusFlow = ['available', 'reserved', 'rented']
  const idx = statusFlow.indexOf(row.status)
  const next = statusFlow[(idx + 1) % statusFlow.length]
  try {
    await changeRoomStatus(row.id, next)
    row.status = next
    ElMessage.success(`状态已变更为「${statusLabel(next)}」`)
  } catch (e) {
    console.error('变更状态失败', e)
  }
}

function handleDelete(row) {
  ElMessageBox.confirm(`确定要删除房源「${row.title}」吗？`, '删除确认', { type: 'warning' })
    .then(async () => {
      try {
        await deleteRoom(row.id)
        roomList.value = roomList.value.filter(r => r.id !== row.id)
        ElNotification({ title: '删除成功', message: `房源「${row.title}」已被成功删除`, type: 'success', duration: 2500 })
      } catch (e) {
        console.error('删除房源失败', e)
      }
    }).catch(() => {})
}

onMounted(() => {
  loadRooms()
})
</script>

<style scoped>
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
</style>
