import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/secure']
const API_URL = process.env.API_URL

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
  if (!isProtected) return NextResponse.next()

  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/?login=true', request.url))
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    return NextResponse.next()
  }

  // Access token expirado → refrescamos
  try {
    const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    })

    if (!refreshRes.ok) throw new Error('Refresh failed')

    const response = NextResponse.next()

    // getSetCookie() devuelve string[] — crítico cuando hay múltiples cookies
    const newCookies = refreshRes.headers.getSetCookie()
    newCookies.forEach(cookie => {
      response.headers.append('set-cookie', cookie)
    })

    return response
  } catch {
    const response = NextResponse.redirect(new URL('/?login=true', request.url))
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')
    return response
  }
}

export const config = {
  matcher: ['/secure/:path*'],
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 < Date.now() + 30_000
  } catch {
    return true
  }
}