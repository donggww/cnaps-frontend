
export const clearingBalanceQuery = {
  id: 'saps-balance-query',
  title: '清算账户余额查询',
  code: 'saps.200.001',
  system: '清算账户系统',
  tag: 'SAPS',
  scenario: '账户头寸监控',
  service: '余额查询',
  description: '用于模拟清算账户头寸查询、可用余额校验和日间流动性监控。',
  status: 'monitor',
  defaultFields: [
    {
      label: '清算账户',
      value: '1000000000000001',
    },
    {
      label: '开户机构',
      value: '人民银行清算总中心',
    },
    {
      label: '查询类型',
      value: '日间可用余额',
    },
  ],
}

