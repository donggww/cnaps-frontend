import { clearingAccount } from './account/clearing-account'
import { largeValuePayment } from './payment/large-value'
import { smallValuePayment } from './payment/small-value'
import { simulationGroup } from './simulation'
import { ccmsGroup } from './ccms'
import { statisticsGroup } from './statistics'

/**
 * 静态菜单定义（含交易元数据）。
 * 侧边栏菜单名称和顺序以后端 SYS_MENU 表为准，
 * 此文件作为后备和交易表单元数据（defaultFields、status、description 等）。
 */
export const menuGroups = [
  // 1. 仿真系统管理
  simulationGroup,
  // 2. 支付交易
  {
    id: 'payment-message',
    title: '支付交易',
    subtitle: '报文发起与回执',
    children: [largeValuePayment, smallValuePayment],
  },
  // 3. 公共控制管理
  ccmsGroup,
  // 4. 清算账户管理（原"清算管理"）
  {
    id: 'clearing-management',
    title: '清算账户管理',
    subtitle: '账户与头寸',
    children: [clearingAccount],
  },
  // 5. 数据统计查询
  statisticsGroup,
]

/** 扁平化交易列表，用于按 code 匹配交易元数据 */
export const flatTransactions = menuGroups.flatMap((group) =>
  group.children.flatMap((category) => category.items),
)
