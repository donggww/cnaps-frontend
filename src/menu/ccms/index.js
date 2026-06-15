export const ccmsGroup = {
  id: 'ccms-management',
  title: '公共控制管理',
  subtitle: '报文监控 · 节点',
  children: [
    {
      id: 'ccms-system',
      title: '公共控制',
      subtitle: '报文与节点',
      items: [
        {
          id: 'ccms-monitor',
          code: 'CCMS_MONITOR',
          title: '报文监控',
          system: 'CCMS',
          tag: 'CTL',
          scenario: '公共控制报文监控',
          service: 'CcmsMonitorService',
          description: 'CCMS 报文收发监控',
          status: 'draft',
          defaultFields: [
            { label: '报文编号', value: 'CCMS-2026-0001' },
          ],
        },
        {
          id: 'ccms-status',
          code: 'CCMS_STATUS',
          title: '节点状态',
          system: 'CCMS',
          tag: 'NODE',
          scenario: '节点状态同步',
          service: 'CcmsStatusService',
          description: 'CCMS 节点状态查询',
          status: 'draft',
          defaultFields: [
            { label: '节点编号', value: 'NODE-001' },
          ],
        },
      ],
    },
  ],
}
