<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Setting, User, Lock, Key } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import * as adminApi from '@/api/admin'

const router = useRouter()
const authStore = useAuthStore()

// 权限检查：非 admin 用户跳转回工作台
if (authStore.user?.role !== 'admin') {
  router.replace('/workbench')
}

const activeTab = ref('users')
const users = ref([])
const roles = ref([])
const menus = ref([])
const loading = ref(false)

// 角色分配对话框
const roleDialog = ref(false)
const selectedUser = ref(null)
const selectedRoleId = ref(null)

// 菜单权限对话框
const menuDialog = ref(false)
const selectedRole = ref(null)
const menuTree = ref([])        // 树形菜单列表
const checkedMenuIds = ref([])  // 当前勾选的菜单 ID

async function fetchAll() {
  loading.value = true
  try {
    const [u, r, m] = await Promise.all([
      adminApi.getAllUsers(),
      adminApi.getAllRoles(),
      adminApi.getAllMenus(),
    ])
    users.value = u
    roles.value = r
    menus.value = m
  } catch (e) {
    ElMessage.error('获取数据失败: ' + e.message)
  } finally {
    loading.value = false
  }
}

function openRoleDialog(user) {
  selectedUser.value = user
  // 获取用户的已有角色
  adminApi.getUserRoles(user.id).then((data) => {
    const ids = data.roleIds || []
    selectedRoleId.value = ids.length > 0 ? ids[0] : null
    roleDialog.value = true
  }).catch(() => {
    selectedRoleId.value = null
    roleDialog.value = true
  })
}

async function saveUserRole() {
  if (!selectedUser.value || !selectedRoleId.value) return
  try {
    await adminApi.assignUserRole(selectedUser.value.id, selectedRoleId.value)
    ElMessage.success('角色分配成功')
    roleDialog.value = false
    await fetchAll()
  } catch (e) {
    ElMessage.error('分配失败: ' + e.message)
  }
}

async function openMenuDialog(role) {
  selectedRole.value = role
  try {
    const menuIds = await adminApi.getRoleMenus(role.roleId)
    checkedMenuIds.value = menuIds || []
    menuDialog.value = true
  } catch (e) {
    ElMessage.error('获取菜单权限失败: ' + e.message)
  }
}

async function saveRoleMenus() {
  if (!selectedRole.value) return
  try {
    await adminApi.updateRoleMenus(selectedRole.value.roleId, checkedMenuIds.value)
    ElMessage.success('菜单权限已更新')
    menuDialog.value = false
  } catch (e) {
    ElMessage.error('更新失败: ' + e.message)
  }
}

function toggleMenu(menuId) {
  const idx = checkedMenuIds.value.indexOf(menuId)
  if (idx >= 0) {
    checkedMenuIds.value.splice(idx, 1)
  } else {
    checkedMenuIds.value.push(menuId)
  }
}

onMounted(fetchAll)
</script>

<template>
  <main class="admin-page">
    <header class="admin-header">
      <div class="admin-header-left">
        <el-icon :size="20"><Setting /></el-icon>
        <div>
          <strong>系统权限管理</strong>
          <span>用户角色与菜单权限配置</span>
        </div>
      </div>
      <el-button type="warning" plain @click="router.push('/workbench')">返回工作台</el-button>
    </header>

    <section class="admin-body">
      <el-tabs v-model="activeTab">
        <!-- Tab 1: 用户角色管理 -->
        <el-tab-pane label="用户角色管理" name="users">
          <el-table :data="users" border stripe v-loading="loading" style="width: 100%">
            <el-table-column prop="id" label="ID" width="70" />
            <el-table-column prop="username" label="操作员号" width="120" />
            <el-table-column prop="realName" label="真实姓名" width="130" />
            <el-table-column prop="institutionName" label="机构" min-width="120" />
            <el-table-column prop="role" label="角色" width="90">
              <template #default="{ row }">
                <el-tag :type="row.role === 'admin' ? 'danger' : 'info'" size="small">
                  {{ row.role === 'admin' ? '管理员' : '普通用户' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="70">
              <template #default="{ row }">
                <el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">
                  {{ row.status === 1 ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="primary" plain :icon="Key" @click="openRoleDialog(row)">
                  分配角色
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- Tab 2: 角色菜单权限 -->
        <el-tab-pane label="角色菜单权限" name="menus">
          <el-table :data="roles" border stripe v-loading="loading" style="width: 100%">
            <el-table-column prop="roleId" label="角色ID" width="80" />
            <el-table-column prop="roleName" label="角色名称" width="150" />
            <el-table-column prop="roleSign" label="标识" width="120" />
            <el-table-column prop="remark" label="描述" min-width="200" />
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="warning" plain :icon="Lock" @click="openMenuDialog(row)">
                  配置菜单
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="menu-summary" v-if="menus.length > 0">
            <h4>系统菜单（共 {{ menus.length }} 项）</h4>
            <div class="menu-tags">
              <el-tag
                v-for="m in menus"
                :key="m.menuId"
                size="small"
                effect="plain"
                style="margin: 4px"
              >
                {{ m.menuName }}
              </el-tag>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </section>

    <!-- 分配角色对话框 -->
    <el-dialog v-model="roleDialog" title="分配角色" width="400px">
      <p v-if="selectedUser" style="margin-bottom: 16px; color: #69788b;">
        用户：<strong>{{ selectedUser.username }}</strong>
      </p>
      <el-select v-model="selectedRoleId" placeholder="请选择角色" style="width: 100%">
        <el-option
          v-for="r in roles"
          :key="r.roleId"
          :label="r.roleName"
          :value="r.roleId"
        />
      </el-select>
      <template #footer>
        <el-button @click="roleDialog = false">取消</el-button>
        <el-button type="primary" @click="saveUserRole">保存</el-button>
      </template>
    </el-dialog>

    <!-- 配置菜单权限对话框 -->
    <el-dialog v-model="menuDialog" title="配置菜单权限" width="500px">
      <p v-if="selectedRole" style="margin-bottom: 16px; color: #69788b;">
        角色：<strong>{{ selectedRole.roleName }}</strong>
      </p>
      <div class="menu-checklist">
        <div
          v-for="m in menus"
          :key="m.menuId"
          class="menu-check-item"
          :class="{ checked: checkedMenuIds.includes(m.menuId) }"
          @click="toggleMenu(m.menuId)"
        >
          <el-checkbox
            :model-value="checkedMenuIds.includes(m.menuId)"
            :label="m.menuName"
            @click.stop
            @change="toggleMenu(m.menuId)"
          />
          <span class="menu-code">{{ m.menuCode }}</span>
        </div>
      </div>
      <template #footer>
        <el-button @click="menuDialog = false">取消</el-button>
        <el-button type="primary" @click="saveRoleMenus">保存</el-button>
      </template>
    </el-dialog>
  </main>
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #eef3f8;
}

.admin-header {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  background: #fff;
  border-bottom: 1px solid #dce5ef;
}

.admin-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-header-left strong,
.admin-header-left span {
  display: block;
}

.admin-header-left strong {
  font-size: 18px;
}

.admin-header-left span {
  margin-top: 3px;
  color: #69788b;
  font-size: 12px;
}

.admin-body {
  padding: 24px 28px;
  max-width: 1200px;
}

.menu-summary {
  margin-top: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #dce5ef;
}

.menu-summary h4 {
  margin: 0 0 12px;
  color: #172033;
  font-size: 15px;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
}

.menu-checklist {
  max-height: 400px;
  overflow-y: auto;
}

.menu-check-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}

.menu-check-item:hover {
  background: #f0f7ff;
}

.menu-check-item.checked {
  background: #e8f3ff;
}

.menu-code {
  margin-left: auto;
  color: #69788b;
  font-size: 12px;
}
</style>
