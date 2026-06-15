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
      localStorage.removeItem('cnaps_menu_tree')
      window.location.href = '/login'
    }
    const msg = err.response?.data?.msg || err.message || '网络异常'
    return Promise.reject(new Error(msg))
  },
)

/** 获取当前用户有权限的菜单编码列表 */
export async function getUserMenus() {
  return http.get('/permission/menus')
}

/** 获取当前用户的完整菜单树 */
export async function getMenuTree() {
  return http.get('/permission/menu-tree')
}
