import { defineStore } from 'pinia'
import { login } from '@/api/auth'
import { getUserMenus, getMenuTree } from '@/api/permission'

const STORAGE_KEY = 'cnaps_auth'
const MENU_TREE_KEY = 'cnaps_menu_tree'

/** 将后端菜单树转为前端侧边栏格式 */
function transformMenuTree(nodes) {
  return (nodes || []).map((node) => {
    const item = {
      id: node.menuCode,
      title: node.menuName,
      code: node.menuCode,
      tag: node.menuTag || '',
      children: [],
      items: [],
    }
    if (node.children && node.children.length > 0) {
      if (node.menuType === 'ITEM') {
        // ITEM 类型没有子节点
      } else if (node.menuType === 'CATEGORY') {
        // CATEGORY → 子节点是 ITEM，平铺到 items
        item.items = transformMenuTree(node.children)
      } else {
        // GROUP → 子节点是 CATEGORY，放到 children
        item.children = transformMenuTree(node.children)
      }
    }
    return item
  })
}

function loadAuth() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { token: '', user: null, menuCodes: [], menuTree: [] }
}

function loadMenuTree() {
  try {
    const saved = localStorage.getItem(MENU_TREE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return []
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    ...loadAuth(),
    menuTree: loadMenuTree(),
    _menuFetched: false,
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'admin',
    hasMenu: (state) => (code) => {
      if (state.user?.role === 'admin') return true
      return state.menuCodes.includes(code)
    },
  },

  actions: {
    async login(payload) {
      const result = await login(payload)
      this.token = result.token
      this.user = {
        username: result.username,
        institutionName: result.institutionName,
        environmentName: result.environmentName,
        role: result.role,
      }
      this.menuCodes = []
      this.menuTree = []
      this._menuFetched = false
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: this.token, user: this.user, menuCodes: [], menuTree: [] }))
      localStorage.removeItem(MENU_TREE_KEY)
    },

    async fetchPermissions() {
      if (this._menuFetched) return
      try {
        const codes = await getUserMenus()
        this.menuCodes = codes || []
        this._menuFetched = true
      } catch {
        this.menuCodes = []
      }
    },

    async fetchMenuTree() {
      try {
        const tree = await getMenuTree()
        this.menuTree = transformMenuTree(tree)
        localStorage.setItem(MENU_TREE_KEY, JSON.stringify(this.menuTree))
      } catch {
        // 保持已有的 localStorage 缓存
      }
    },

    logout() {
      this.token = ''
      this.user = null
      this.menuCodes = []
      this.menuTree = []
      this._menuFetched = false
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(MENU_TREE_KEY)
    },
  },
})
