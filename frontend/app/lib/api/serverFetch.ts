import { cookies } from 'next/headers'

const API_URL = process.env.API_URL || 'http://localhost:3001'

export async function serverFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('access_token')?.value

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Cookie: `access_token=${accessToken}` }),
      ...options.headers,
    },
  })

  return response
}