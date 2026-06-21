import { appConfig } from './app-config'

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export const apiRequest = async <ResponseBody>(path: string, options: ApiRequestOptions = {}): Promise<ResponseBody> => {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'content-type': 'application/json',
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = payload?.error?.message ?? `API request failed with ${response.status}`
    throw new Error(message)
  }

  return payload as ResponseBody
}
