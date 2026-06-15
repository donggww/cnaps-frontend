export const statisticsGroup = {
  id: 'statistics-management',
  title: '数据统计查询',
  subtitle: '报表 · 分析',
  children: [
    {
      id: 'statistics-system',
      title: '统计查询',
      subtitle: '交易与清算',
      items: [
        {
          id: 'transaction-statistics',
          code: 'STAT_TRANSACTION',
          title: '交易统计',
          system: 'STAT',
          tag: 'TXN',
          scenario: '交易数据统计查询',
          service: 'TransactionStatService',
          description: '按维度统计交易数据',
          status: 'draft',
          defaultFields: [
            { label: '统计日期', value: '2026-06-16' },
          ],
        },
        {
          id: 'clearing-statistics',
          code: 'STAT_CLEARING',
          title: '清算统计',
          system: 'STAT',
          tag: 'CLR',
          scenario: '清算数据统计查询',
          service: 'ClearingStatService',
          description: '清算汇总数据查询',
          status: 'draft',
          defaultFields: [
            { label: '统计日期', value: '2026-06-16' },
          ],
        },
      ],
    },
  ],
}
