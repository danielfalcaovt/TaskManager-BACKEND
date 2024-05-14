import { EmailValidator } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidator Controller', () => {
  test('Should return false if email is invalid', () => {
    const sut = new EmailValidator()
    sut.isValid('valid_email')
  })
  test('Should return false if email is invalid', () => {
    const sut = new EmailValidator()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    sut.isValid('invalid_email')
  })
  test('Should call isEmail with correct value', () => {
    const sut = new EmailValidator()
    const validatorSpy = jest.spyOn(validator, 'isEmail')
    sut.isValid('any_mail@mail.com')
    expect(validatorSpy).toHaveBeenCalledWith('any_mail@mail.com')
  })
})
