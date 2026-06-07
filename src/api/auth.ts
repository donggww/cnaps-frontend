export interface LoginPayload {
  username: string
  password: string
  institution: string
  environment: string
}

export interface LoginResult {
  token: string
  username: string
  institutionName: string
  environmentName: string
}

const institutionNames: Record<string, string> = {
  '102100088898': '枭龙银行',
}

const environmentNames: Record<string, string> = {
  FAT: 'FAT环境',
  SIT: 'SIT环境',
  UAT: 'UAT环境',
}

export async function login(payload: LoginPayload): Promise<LoginResult> {
  await new Promise((resolve) => window.setTimeout(resolve, 600))

  return {
    token: `mock-token-${Date.now()}`,
    username: payload.username,
    institutionName: institutionNames[payload.institution] ?? payload.institution,
    environmentName: environmentNames[payload.environment] ?? payload.environment,
  }
}
