import type { TransactionCategory } from '@/menu/types'

import { clearingBalanceQuery } from './balanceQuery'

export const clearingAccount: TransactionCategory = {
  id: 'clearing-account',
  title: '清算账户系统',
  subtitle: '头寸 · 余额 · 限额',
  items: [clearingBalanceQuery],
}

