
export const smallValueBatchDebit = {
  id: 'beps-batch-debit',
  title: '小额批量借记',
  code: 'beps.351.001',
  system: '小额支付系统',
  tag: 'BEPS',
  scenario: '批量代收业务',
  service: '定期借记',
  description: '用于模拟小额批量代收、批次汇总、轧差处理和批量回执。',
  status: 'draft',
  defaultFields: [
    {
      label: '发起清算行',
      value: '102100099996',
    },
    {
      label: '批次号',
      value: 'BEPS20260607001',
    },
    {
      label: '业务种类',
      value: '定期借记业务',
    },
  ],
}

