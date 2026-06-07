import type { TransactionItem } from '@/menu/types'

export const largeValueRemittance: TransactionItem = {
  id: 'hvps-large-remittance',
  title: '大额贷记往账',
  code: 'hvps.111.001',
  system: '大额支付系统',
  tag: 'HVPS',
  scenario: '跨行实时资金汇划',
  service: '普通贷记',
  description: '用于模拟高金额跨行资金汇划、清算状态跟踪和报文回执处理。',
  status: 'ready',
  defaultFields: [
    {
      label: '发起行行号',
      value: '402331000007',
    },
    {
      label: '接收行行号',
      value: '313100000013',
    },
    {
      label: '业务种类',
      value: '普通贷记业务',
    },
  ],
}

