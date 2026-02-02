import { AppError } from '../../../src/utils/AppError'

describe('AppError', () => {
  test('Error con mensaje y Statuscode correcto', () => {
    const error = new AppError('Error Not found', 404)
    expect(error.message).toBe('Error Not found')
    expect(error.statusCode).toBe(404)
  })
  test('isOperational es true', () => {
    const error = new AppError('Error Not found', 404)
    expect(error.isOperational).toBeTruthy()
  })
  test('Hereda de Error', () => {
    const error = new AppError('Error Not found', 404)
    expect(error).toBeInstanceOf(Error)
  })
})
