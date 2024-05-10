import { Login } from './login'
import { MissingParamError } from './login-protocols'

const makeSut = (): Login => {
  const sut = new Login()
  return sut
}

describe('Login', () => {
  test('Should return 400 if no email provided.', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.authenticate(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email').message)
  })
  test('Should return 400 if no password provided.', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.authenticate(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password').message)
  })
})
