import { Response } from 'express'
import config from '../config/config'

export const setAccessTokenCookie = (res: Response, token: string) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseJwtTimeToMs(config.jwt.accessTokenExpiry)
  })
}

export const setRefreshTokenCookie = (res: Response, token: string) => {
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseJwtTimeToMs(config.jwt.refreshTokenExpiry)
  })
}

export const clearAuthCookie = (res: Response) => {
  res.clearCookie('access_token')
  res.clearCookie('refresh_token')
}

const parseJwtTimeToMs = (time: string): number => {
  const value = parseInt(time)
  const unit = time.slice(-1)

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000
  }

  return value * (multipliers[unit] || 1000)
}
