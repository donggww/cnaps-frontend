
import { clearingAccount } from './account/clearing-account'
import { largeValuePayment } from './payment/large-value'
import { smallValuePayment } from './payment/small-value'

export const menuGroups= [
  {
    id: 'payment-message',
    title: '支付交易',
    subtitle: '报文发起与回执',
    children: [largeValuePayment, smallValuePayment],
  },
  {
    id: 'clearing-management',
    title: '清算管理',
    subtitle: '账户与头寸',
    children: [clearingAccount],
  },
]

export const flatTransactions= menuGroups.flatMap((group) =>
  group.children.flatMap((category) => category.items),
)

