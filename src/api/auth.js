export async function login(payload) {
  await new Promise((resolve) => window.setTimeout(resolve, 600))

  const institutionNames = {
    '102100088898': '枭龙银行',
  }

  const environmentNames = {
    FAT: 'FAT环境',
    SIT: 'SIT环境',
    UAT: 'UAT环境',
  }

  return {
    token: `mock-token-${Date.now()}`,
    username: payload.username,
    institutionName: institutionNames[payload.institution] ?? payload.institution,
    environmentName: environmentNames[payload.environment] ?? payload.environment,
  }
}
