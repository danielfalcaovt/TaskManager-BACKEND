/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/return-await */
import { register } from './register'
import { InvalidParamError, MissingParamError, type EmailValidator, type Encrypter } from './register-protocols'

interface sutTypes {
  sut: register
  emailValidatorStub: EmailValidator
  encrypterStub: Encrypter
}

const makeSut = (): sutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const encrypterStub = makeEncrypter()
  const sut = new register(emailValidatorStub, encrypterStub)
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

describe('register', () => {
  test('Should return 400 if no username was provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    const httpResponse = await sut.registerUser(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('username').message)
  })
  test('Should return 400 if no username was provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    const httpResponse = await sut.registerUser(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email').message)
  })
  test('Should return 400 if no password was provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_email',
        confirmPassword: 'any_password'
      }
    }
    const httpResponse = await sut.registerUser(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password').message)
  })
  test('Should return 400 if no confirmPassword was provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_email',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.registerUser(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('confirmPassword').message)
  })
  test('Should return 400 if email is invalid.', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        username: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        confirmPassword: 'any_password'
      }
    }
    const httpResponse = await sut.registerUser(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email').message)
  })
  test('Should return 400 if password not match', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        username: 'any_username',
        email: 'any_mail',
        password: 'any_password',
        confirmPassword: 'different_password'
      }
    }
    const httpResponse = await sut.registerUser(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('confirmPassword').message)
  })
})
