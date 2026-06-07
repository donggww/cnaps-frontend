import type { TransactionCategory } from '@/menu/types'

import { smallValueBatchDebit } from './batchDebit'

export const smallValuePayment: TransactionCategory = {
  id: 'small-value-payment',
  title: '小额支付系统',
  subtitle: '批量轧差 · 回执',
  items: [smallValueBatchDebit],
}

