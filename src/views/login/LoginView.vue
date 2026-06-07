<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, Monitor, OfficeBuilding, User } from '@element-plus/icons-vue'

import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  username: 'operator01',
  password: 'cnaps@2026',
  institution: '102100088898',
  environment: 'SIT',
})

const rules: FormRules = {
  username: [{ required: true, message: '请输入操作员号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }],
  institution: [{ required: true, message: '请选择接入机构', trigger: 'change' }],
  environment: [{ required: true, message: '请选择运行环境', trigger: 'change' }],
}

async function handleLogin() {
  if (!formRef.value) return

  await formRef.value.validate()
  loading.value = true

  try {
    await authStore.login(loginForm)
    ElMessage.success('登录成功')
    router.push('/workbench')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <header class="login-header">
      <div class="brand-copy">
        <strong>人民银行二代支付系统仿真平台</strong>
        <span>Payment Simulation Console</span>
      </div>
      <div class="version">V0.1.0</div>
    </header>

    <section class="login-shell">
      <section class="login-card">
        <div class="form-heading">
          <h1>用户登录</h1>
        </div>

        <el-form
          ref="formRef"
          class="login-form"
          :model="loginForm"
          :rules="rules"
          size="large"
          @keyup.enter="handleLogin"
        >
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="操作员号" :prefix-icon="User" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="登录密码"
              type="password"
              show-password
              :prefix-icon="Lock"
            />
          </el-form-item>
          <el-form-item prop="institution">
            <el-select
              v-model="loginForm.institution"
              class="full-field"
              placeholder="接入机构"
              :prefix-icon="OfficeBuilding"
            >
              <el-option label="102100088898 - 枭龙银行" value="102100088898" />
            </el-select>
          </el-form-item>
          <el-form-item prop="environment">
            <el-select
              v-model="loginForm.environment"
              class="full-field"
              placeholder="运行环境"
              :prefix-icon="Monitor"
            >
              <el-option label="FAT环境" value="FAT" />
              <el-option label="SIT环境" value="SIT" />
              <el-option label="UAT环境" value="UAT" />
            </el-select>
          </el-form-item>

          <el-button class="login-button" type="primary" :loading="loading" @click="handleLogin">
            登 录
          </el-button>
        </el-form>
      </section>
    </section>

    <footer class="login-footer">Copyright © 2026 CNAPS Simulation Lab</footer>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  color: #f7fbff;
  background:
    linear-gradient(120deg, rgba(6, 28, 62, 0.96), rgba(5, 103, 170, 0.84)),
    url('/reference/login-reference.jpg') center / cover no-repeat;
  overflow: hidden;
  position: relative;
}

.login-page::before {
  content: '';
  position: absolute;
  inset: 72px 0 0;
  background:
    radial-gradient(circle at 28% 42%, rgba(46, 213, 255, 0.3), transparent 28%),
    radial-gradient(circle at 72% 58%, rgba(43, 204, 148, 0.2), transparent 24%);
  pointer-events: none;
}

.login-header {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 48px;
  background: rgba(4, 34, 73, 0.82);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
  position: relative;
  z-index: 1;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-copy strong {
  font-size: 16px;
  font-weight: 700;
}

.brand-copy span,
.version,
.login-footer {
  color: rgba(233, 244, 255, 0.72);
  font-size: 12px;
}

.version {
  margin-left: auto;
}

.login-shell {
  min-height: calc(100vh - 116px);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px;
  position: relative;
  z-index: 1;
}

.login-card {
  width: 440px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.96);
  color: #172033;
  box-shadow: 0 28px 80px rgba(0, 14, 39, 0.32);
  padding: 38px;
}

.form-heading {
  margin-bottom: 26px;
  text-align: center;
}

.form-heading h1 {
  margin: 8px 0 0;
  font-size: 28px;
  font-weight: 800;
}

.login-form :deep(.el-input__wrapper),
.login-form :deep(.el-select__wrapper) {
  min-height: 46px;
  border-radius: 6px;
}

.full-field {
  width: 100%;
}

.login-button {
  width: 100%;
  height: 46px;
  border-radius: 6px;
  font-weight: 700;
  background: linear-gradient(135deg, #0879dc, #05a7d8);
  border: 0;
}

.login-footer {
  height: 44px;
  display: grid;
  place-items: center;
  background: rgba(3, 38, 79, 0.34);
  position: relative;
  z-index: 1;
}

@media (max-width: 980px) {
  .login-header {
    padding: 0 20px;
  }

  .login-shell {
    padding: 28px 18px;
  }
}

@media (max-width: 560px) {
  .brand-copy span,
  .version {
    display: none;
  }

  .login-card {
    padding: 26px 20px;
  }
}
</style>
