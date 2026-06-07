import type { TransactionCategory } from '@/menu/types'

import { largeValueRemittance } from './remittance'

export const largeValuePayment: TransactionCategory = {
  id: 'large-value-payment',
  title: '大额支付系统',
  subtitle: '实时清算 · 高金额',
  items: [largeValueRemittance],
}

