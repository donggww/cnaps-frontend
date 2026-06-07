<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Bell,
  CircleCheckFilled,
  Coin,
  DataAnalysis,
  DocumentChecked,
  Fold,
  Money,
  Operation,
  Refresh,
  SwitchButton,
  TrendCharts,
} from '@element-plus/icons-vue'

import { flatTransactions, menuGroups } from '@/menu'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const activeTransactionId = ref(flatTransactions[0]?.id ?? '')
const traceNo = ref(2606070001)
const menuCollapsed = ref(false)

function toggleMenu() {
  menuCollapsed.value = !menuCollapsed.value
}

const transactionForm = reactive({
  payerName: '深圳市银拓科技有限公司',
  payeeName: '上海模拟收款企业',
  amount: 3200000,
  purpose: '货款结算',
  priority: '普通',
})

const activeTransaction = computed(() => {
  return flatTransactions.find((item) => item.id === activeTransactionId.value) ?? flatTransactions[0]
})

const activeFields = computed(() => activeTransaction.value.defaultFields)

const statusText = computed(() => {
  if (activeTransaction.value.status === 'ready') return '可发起'
  if (activeTransaction.value.status === 'draft') return '待补录'
  return '监控中'
})

const messagePreview = computed(() => {
  const transaction = activeTransaction.value
  const amount = Number(transactionForm.amount).toFixed(2)

  return [
    '<CnapsMessage>',
    `  <MsgId>${transaction.code}.${traceNo.value}</MsgId>`,
    `  <BizSvc>${transaction.service}</BizSvc>`,
    `  <System>${transaction.tag}</System>`,
    `  <Payer>${transactionForm.payerName}</Payer>`,
    `  <Payee>${transactionForm.payeeName}</Payee>`,
    `  <Amount Ccy="CNY">${amount}</Amount>`,
    `  <Purpose>${transactionForm.purpose}</Purpose>`,
    `  <Priority>${transactionForm.priority}</Priority>`,
    '</CnapsMessage>',
  ].join('\n')
})

const metrics = [
  {
    label: '今日发起',
    value: '1,286',
    trend: '+12.4%',
    icon: DataAnalysis,
    tone: 'blue',
  },
  {
    label: '待处理回执',
    value: '43',
    trend: '8 min',
    icon: DocumentChecked,
    tone: 'amber',
  },
  {
    label: '清算成功率',
    value: '99.82%',
    trend: '稳定',
    icon: CircleCheckFilled,
    tone: 'green',
  },
]

const activities = [
  {
    time: '17:31:08',
    text: 'HVPS 往账报文已通过格式校验',
    type: 'success',
  },
  {
    time: '17:28:42',
    text: 'BEPS 批量借记批次进入轧差队列',
    type: 'primary',
  },
  {
    time: '17:21:16',
    text: 'SAPS 清算账户余额完成同步',
    type: 'info',
  },
]

watch(
  activeTransaction,
  (transaction) => {
    if (transaction.tag === 'BEPS') {
      transactionForm.amount = 68000
      transactionForm.priority = '批量'
      transactionForm.purpose = '批量代收'
    } else if (transaction.tag === 'SAPS') {
      transactionForm.amount = 0
      transactionForm.priority = '查询'
      transactionForm.purpose = '头寸监控'
    } else {
      transactionForm.amount = 3200000
      transactionForm.priority = '普通'
      transactionForm.purpose = '货款结算'
    }
  },
  { immediate: true },
)

function handleSelect(index) {
  if (flatTransactions.some((item) => item.id === index)) {
    activeTransactionId.value = index
  }
}

function generateMessage() {
  traceNo.value += 1
  ElMessage.success('报文已生成')
}

function submitSimulation() {
  traceNo.value += 1
  ElMessage.success('交易已进入仿真队列')
}

function logout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <main class="workbench-page">
    <aside class="sidebar" :class="{ collapsed: menuCollapsed }">
      <div class="sidebar-brand">
        <div class="brand-badge">CN</div>
        <div>
          <strong>CNAPS II</strong>
          <span>仿真控制台</span>
        </div>
      </div>

      <el-menu
        class="trade-menu"
        :default-active="activeTransactionId"
        background-color="transparent"
        text-color="#b8c7dc"
        active-text-color="#ffffff"
        @select="handleSelect"
      >
        <el-sub-menu v-for="group in menuGroups" :key="group.id" :index="group.id">
          <template #title>
            <el-icon><Operation /></el-icon>
            <span>{{ group.title }}</span>
          </template>
          <el-sub-menu v-for="category in group.children" :key="category.id" :index="category.id">
            <template #title>
              <span>{{ category.title }}</span>
            </template>
            <el-menu-item v-for="item in category.items" :key="item.id" :index="item.id">
              <span>{{ item.title }}</span>
              <em>{{ item.tag }}</em>
            </el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>

      <div class="sidebar-status">
        <span>报文通道</span>
        <strong>ONLINE</strong>
      </div>
    </aside>

    <section class="workspace">
      <header class="topbar">
        <div class="topbar-title">
          <el-icon :class="{ rotated: menuCollapsed }" @click="toggleMenu" style="cursor:pointer"><Fold /></el-icon>
          <div>
            <strong>二代支付交易工作台</strong>
            <span>{{ authStore.user?.institutionName ?? '模拟接入机构' }}</span>
          </div>
        </div>
        <div class="topbar-actions">
          <el-tag type="success" effect="dark">{{ authStore.user?.environmentName ?? '仿真沙箱环境' }}</el-tag>
          <el-button :icon="Bell" circle />
          <el-button :icon="SwitchButton" @click="logout">退出</el-button>
        </div>
      </header>

      <section class="metrics-row">
        <article v-for="metric in metrics" :key="metric.label" class="metric" :class="metric.tone">
          <div class="metric-icon">
            <component :is="metric.icon" />
          </div>
          <div>
            <span>{{ metric.label }}</span>
            <strong>{{ metric.value }}</strong>
          </div>
          <em>{{ metric.trend }}</em>
        </article>
      </section>

      <section class="content-grid">
        <section class="trade-panel">
          <div class="panel-heading">
            <div>
              <span>{{ activeTransaction.system }}</span>
              <h1>{{ activeTransaction.title }}</h1>
            </div>
            <div class="status-pill">{{ statusText }}</div>
          </div>

          <div class="summary-strip">
            <div>
              <span>报文编号</span>
              <strong>{{ activeTransaction.code }}</strong>
            </div>
            <div>
              <span>业务场景</span>
              <strong>{{ activeTransaction.scenario }}</strong>
            </div>
            <div>
              <span>业务类型</span>
              <strong>{{ activeTransaction.service }}</strong>
            </div>
          </div>

          <el-form class="trade-form" label-position="top">
            <div class="field-grid">
              <el-form-item v-for="field in activeFields" :key="field.label" :label="field.label">
                <el-input :model-value="field.value" readonly />
              </el-form-item>
              <el-form-item label="付款人户名">
                <el-input v-model="transactionForm.payerName" />
              </el-form-item>
              <el-form-item label="收款人户名">
                <el-input v-model="transactionForm.payeeName" />
              </el-form-item>
              <el-form-item label="金额">
                <el-input-number
                  v-model="transactionForm.amount"
                  :min="0"
                  :precision="2"
                  :step="1000"
                  controls-position="right"
                />
              </el-form-item>
              <el-form-item label="优先级">
                <el-select v-model="transactionForm.priority">
                  <el-option label="普通" value="普通" />
                  <el-option label="加急" value="加急" />
                  <el-option label="批量" value="批量" />
                  <el-option label="查询" value="查询" />
                </el-select>
              </el-form-item>
            </div>
            <el-form-item label="用途/附言">
              <el-input v-model="transactionForm.purpose" type="textarea" :rows="3" />
            </el-form-item>
          </el-form>

          <div class="action-bar">
            <el-button :icon="Refresh">重置</el-button>
            <el-button type="primary" plain :icon="DocumentChecked" @click="generateMessage">生成报文</el-button>
            <el-button type="primary" :icon="Money" @click="submitSimulation">提交仿真</el-button>
          </div>
        </section>

        <section class="side-panels">
          <section class="message-panel">
            <div class="panel-heading compact">
              <div>
                <span>MESSAGE PREVIEW</span>
                <h2>报文预览</h2>
              </div>
              <el-tag>{{ activeTransaction.tag }}</el-tag>
            </div>
            <pre>{{ messagePreview }}</pre>
          </section>

          <section class="timeline-panel">
            <div class="panel-heading compact">
              <div>
                <span>RUN STATUS</span>
                <h2>运行动态</h2>
              </div>
              <el-icon><TrendCharts /></el-icon>
            </div>
            <el-timeline>
              <el-timeline-item
                v-for="activity in activities"
                :key="activity.time"
                :timestamp="activity.time"
                :type="activity.type"
              >
                {{ activity.text }}
              </el-timeline-item>
            </el-timeline>
          </section>

          <section class="liquidity-panel">
            <div>
              <span>清算账户可用头寸</span>
              <strong>¥ 86,420,000.00</strong>
            </div>
            <el-icon><Coin /></el-icon>
          </section>
        </section>
      </section>
    </section>
  </main>
</template>

<style scoped>
.workbench-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  background: #eef3f8;
  color: #172033;
}

.sidebar {
  background: linear-gradient(180deg, #062852 0%, #071b38 100%);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  box-shadow: 18px 0 48px rgba(7, 27, 56, 0.18);
}

.sidebar-brand {
  height: 82px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-badge {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e63b3b, #ff8f4c);
  font-weight: 800;
}

.sidebar-brand strong,
.sidebar-brand span {
  display: block;
}

.sidebar-brand span {
  margin-top: 3px;
  color: #91a7c2;
  font-size: 12px;
}

.trade-menu {
  border-right: 0;
  padding: 12px 10px;
}

.trade-menu :deep(.el-sub-menu__title),
.trade-menu :deep(.el-menu-item) {
  border-radius: 6px;
  margin: 4px 0;
}

.trade-menu :deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #0879dc, #05a7d8);
  box-shadow: 0 14px 30px rgba(4, 129, 218, 0.26);
}

.trade-menu em {
  margin-left: auto;
  color: #7ee2ff;
  font-size: 11px;
  font-style: normal;
}

.sidebar-status {
  margin: auto 16px 18px;
  padding: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar-status span,
.sidebar-status strong {
  display: block;
}

.sidebar-status span {
  color: #9fb3c9;
  font-size: 12px;
}

.sidebar-status strong {
  margin-top: 8px;
  color: #63f3ba;
}
.sidebar.collapsed {
  width: 0;
  min-width: 0;
  padding: 0;
  overflow: hidden;
  box-shadow: none;
  transition: all 0.3s ease;
}

.sidebar.collapsed .sidebar-brand {
  display: none;
}

.sidebar.collapsed .trade-menu {
  display: none;
}

.sidebar.collapsed .sidebar-status {
  display: none;
}


.workspace {
  min-width: 0;
}

.topbar {
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 28px;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid #dce5ef;
}

.topbar-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-title > .el-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #e8f3ff;
  color: #0879dc;
}

.topbar-title strong,
.topbar-title span {
  display: block;
}

.topbar-title strong {
  font-size: 18px;
}

.topbar-title span {
  margin-top: 3px;
  color: #69788b;
  font-size: 12px;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.metrics-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  padding: 22px 28px 0;
}

.metric {
  min-height: 96px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #dce5ef;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  box-shadow: 0 12px 28px rgba(32, 56, 88, 0.06);
}

.metric-icon {
  width: 46px;
  height: 46px;
  border-radius: 8px;
  display: grid;
  place-items: center;
}

.metric-icon svg {
  width: 24px;
  height: 24px;
}

.metric span,
.metric strong {
  display: block;
}

.metric span {
  color: #728095;
  font-size: 12px;
}

.metric strong {
  margin-top: 4px;
  font-size: 24px;
}

.metric em {
  margin-left: auto;
  font-style: normal;
  font-weight: 700;
}

.metric.blue .metric-icon {
  color: #0879dc;
  background: #e8f3ff;
}

.metric.blue em {
  color: #0879dc;
}

.metric.amber .metric-icon {
  color: #b96b00;
  background: #fff4de;
}

.metric.amber em {
  color: #b96b00;
}

.metric.green .metric-icon {
  color: #1b8a5a;
  background: #e8f8f0;
}

.metric.green em {
  color: #1b8a5a;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(360px, 0.75fr);
  gap: 18px;
  padding: 18px 28px 28px;
}

.trade-panel,
.message-panel,
.timeline-panel,
.liquidity-panel {
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #dce5ef;
  box-shadow: 0 12px 28px rgba(32, 56, 88, 0.06);
}

.trade-panel {
  padding: 24px;
}

.panel-heading {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.panel-heading span {
  color: #0879dc;
  font-size: 12px;
  font-weight: 700;
}

.panel-heading h1,
.panel-heading h2 {
  margin: 6px 0 0;
  font-weight: 800;
}

.panel-heading h1 {
  font-size: 26px;
}

.panel-heading h2 {
  font-size: 17px;
}

.panel-heading.compact {
  align-items: center;
  margin-bottom: 14px;
}

.status-pill {
  flex: 0 0 auto;
  border-radius: 999px;
  color: #126648;
  background: #e8f8f0;
  border: 1px solid #bee8d4;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 700;
}

.summary-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.summary-strip div {
  border-radius: 8px;
  padding: 14px;
  background: #f5f8fb;
  border: 1px solid #e3ebf3;
}

.summary-strip span,
.summary-strip strong {
  display: block;
}

.summary-strip span {
  color: #69788b;
  font-size: 12px;
}

.summary-strip strong {
  margin-top: 6px;
  font-size: 14px;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2px 14px;
}

.trade-form :deep(.el-input-number),
.trade-form :deep(.el-select) {
  width: 100%;
}

.trade-form :deep(.el-input__wrapper),
.trade-form :deep(.el-select__wrapper),
.trade-form :deep(.el-textarea__inner) {
  border-radius: 6px;
}

.action-bar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 6px;
}

.side-panels {
  display: grid;
  gap: 18px;
}

.message-panel,
.timeline-panel {
  padding: 18px;
}

.message-panel pre {
  min-height: 232px;
  margin: 0;
  padding: 16px;
  overflow: auto;
  border-radius: 8px;
  color: #d8f4ff;
  background: #071b38;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 12px;
  line-height: 1.7;
}

.timeline-panel :deep(.el-timeline) {
  padding-left: 4px;
}

.liquidity-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 104px;
  padding: 20px;
  color: #ffffff;
  border: 0;
  background:
    linear-gradient(135deg, rgba(7, 121, 220, 0.94), rgba(4, 167, 160, 0.86)),
    url('/reference/workspace-reference.jpg') center / cover no-repeat;
}

.liquidity-panel span,
.liquidity-panel strong {
  display: block;
}

.liquidity-panel span {
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
}

.liquidity-panel strong {
  margin-top: 8px;
  font-size: 23px;
}

.liquidity-panel .el-icon {
  font-size: 40px;
  opacity: 0.88;
}

@media (max-width: 1180px) {
  .workbench-page {
    grid-template-columns: 240px minmax(0, 1fr);
  }

  .content-grid,
  .metrics-row {
    grid-template-columns: 1fr;
  }

  .field-grid,
  .summary-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .workbench-page {
    grid-template-columns: 1fr;
  }

  .sidebar {
    min-height: auto;
  }

  .topbar,
  .topbar-actions,
  .metrics-row,
  .content-grid {
    padding-left: 16px;
    padding-right: 16px;
  }

  .topbar {
    height: auto;
    min-height: 82px;
    align-items: flex-start;
    flex-direction: column;
    padding-top: 16px;
    padding-bottom: 16px;
  }

  .metrics-row,
  .content-grid,
  .field-grid,
  .summary-strip {
    grid-template-columns: 1fr;
  }

  .action-bar {
    flex-wrap: wrap;
  }
}
</style>

