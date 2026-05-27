import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi, getUserInfo } from '@/api'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))

  const isLoggedIn = computed(() => !!userInfo.value)
  const userName = computed(() => userInfo.value?.name || '')
  const userRole = computed(() => userInfo.value?.role_type || '')
  const isAdmin = computed(() => userInfo.value?.role_type === 'admin')
  const isManager = computed(() => userInfo.value?.role_type === 'manager')
  const isTenant = computed(() => userInfo.value?.role_type === 'tenant')

  async function login(data) {
    const res = await loginApi(data)
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token)
      userInfo.value = res.data.user
      localStorage.setItem('userInfo', JSON.stringify(res.data.user))
    }
    return res
  }

  async function fetchUserInfo() {
    const res = await getUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data
      localStorage.setItem('userInfo', JSON.stringify(res.data))
    }
    return res
  }

  function logout() {
    userInfo.value = null
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }

  return { userInfo, isLoggedIn, userName, userRole, isAdmin, isManager, isTenant, login, fetchUserInfo, logout }
})
