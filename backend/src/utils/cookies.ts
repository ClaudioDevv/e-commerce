import { Response } from 'express'

export const setAuthCookie = (res: Response, token: string) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
}

export const clearAuthCookie = (res: Response) => {
  res.clearCookie('access_token')
}
