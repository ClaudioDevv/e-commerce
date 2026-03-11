export async function clientFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (response.status === 401) {
    window.location.href = '/?login=true'
    throw new Error('Sesión expirada')
  }

  return response
}