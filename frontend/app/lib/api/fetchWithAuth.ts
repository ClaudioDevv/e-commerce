const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

function processQueue(error: Error | null) {
  failedQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })
  failedQueue = []
}

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  // Primera petición
  let response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  })

  // Si es 401 (token expirado), intenta refrescar
  if (response.status === 401) {
    if (isRefreshing) {
      // Si ya hay un refresh en curso, espera
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then(() => {
        // Reintenta la petición original después del refresh
        return fetch(url, {
          ...options,
          headers,
          credentials: 'include',
        })
      })
    }

    isRefreshing = true

    try {
      // Llama al endpoint de refresh
      const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!refreshResponse.ok) {
        throw new Error('Refresh token inválido o expirado')
      }

      // Refresh exitoso, procesa la cola
      processQueue(null)
      isRefreshing = false

      // Reintenta la petición original con el nuevo access token
      response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      })

      return response
    } catch (error) {
      // Refresh falló, cierra sesión
      processQueue(error as Error)
      isRefreshing = false

      // Redirige al login o limpia la sesión
      window.location.href = '/'
      throw error
    }
  }

  return response
}