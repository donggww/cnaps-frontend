import axios from 'axios'

const http = axios.create({
  baseURL: '/auth/api',
  timeout: 10000,
})

http.interceptors.request.use((config) => {
  let auth
  try {
    const raw = localStorage.getItem('cnaps_auth')
    if (raw) auth = JSON.parse(raw)
  } catch {}
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => {
    const body = res.data
    if (body.code !== 200) {
      return Promise.reject(new Error(body.msg || '请求失败'))
    }
    return body.data
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cnaps_auth')
      window.location.href = '/login'
    }
    const msg = err.response?.data?.msg || err.message || '网络异常'
    return Promise.reject(new Error(msg))
  },
)

/** 用户管理 */
export function getAllUsers() {
  return http.get('/admin/users')
}
export function getUserRoles(userId) {
  return http.get(`/admin/users/${userId}/roles`)
}
export function assignUserRole(userId, roleId) {
  return http.put(`/admin/users/${userId}/roles`, { roleId })
}

/** 角色管理 */
export function getAllRoles() {
  return http.get('/admin/roles')
}

/** 菜单管理 */
export function getAllMenus() {
  return http.get('/admin/menus')
}
export function createMenu(menu) {
  return http.post('/admin/menus', menu)
}
export function updateMenu(menu) {
  return http.put('/admin/menus', menu)
}
export function deleteMenu(menuId) {
  return http.delete(`/admin/menus/${menuId}`)
}

/** 角色菜单权限 */
export function getRoleMenus(roleId) {
  return http.get(`/admin/roles/${roleId}/menus`)
}
export function updateRoleMenus(roleId, menuIds) {
  return http.put(`/admin/roles/${roleId}/menus`, menuIds)
}
