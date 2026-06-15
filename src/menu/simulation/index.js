export const simulationGroup = {
  id: 'simulation-management',
  title: '仿真系统管理',
  subtitle: '系统运维 · 配置',
  children: [
    {
      id: 'simulation-system',
      title: '系统管理',
      subtitle: '运行监控',
      items: [
        {
          id: 'system-monitor',
          code: 'SIM_MONITOR',
          title: '系统监控',
          system: 'CNAPS-SIM',
          tag: 'SYS',
          scenario: '系统状态监控',
          service: 'SystemMonitorService',
          description: '仿真系统运行状态监控',
          status: 'draft',
          defaultFields: [
            { label: '节点名称', value: 'SIM-NODE-01' },
          ],
        },
        {
          id: 'simulation-config',
          code: 'SIM_CONFIG',
          title: '仿真配置',
          system: 'CNAPS-SIM',
          tag: 'CFG',
          scenario: '仿真参数配置',
          service: 'SimConfigService',
          description: '仿真环境参数配置',
          status: 'draft',
          defaultFields: [
            { label: '配置项', value: '参数名称' },
          ],
        },
      ],
    },
  ],
}
