/* eslint-disable @typescript-eslint/return-await */
import { Login } from './login'
import { type EmailValidator, ServerError, InvalidParamError, type Encrypter, MissingParamError } from './login-protocols'

interface sutTypes {
  sut: Login
  emailValidatorStub: EmailValidator
  encrypterStub: Encrypter
}

const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const encrypterStub = makeEncrypter()
  const sut = new Login(emailValidatorStub, encrypterStub)
  return {
    emailValidatorStub,
    encrypterStub,
    sut
  }
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  return emailValidatorStub
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => {
        resolve('hashedValue')
      })
    }

    async compare (value: string, hash: string): Promise<boolean> {
      return new Promise(resolve => {
        resolve(true)
      })
    }
  }
  const encrypterStub = new EncrypterStub()
  return encrypterStub
}

describe('Login', () => {
  test('Should return 400 if no email provided.', async () => {
    const { sut } = makeSut()
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
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email'
      }
    }
    const httpResponse = await sut.authenticate(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password').message)
  })
  test('Should return 400 if email is invalid.', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.authenticate(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email').message)
  })
  test('Should throws if emailValidator throw', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.authenticate(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
