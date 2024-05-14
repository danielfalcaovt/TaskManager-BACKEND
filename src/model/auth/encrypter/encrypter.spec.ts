import { Encrypter } from './Encrypter'

describe('Encrypter', () => {
  test('Method encrypt should return a hashedValue.', async () => {
    const sut = new Encrypter()
    jest.spyOn(sut, 'encrypt').mockReturnValueOnce(
      new Promise((resolve) => {
        resolve('hashedValue')
      })
    )
    const valueToHash = 'any_value'
    const hashedValue = await sut.encrypt(valueToHash)
    expect(hashedValue).toEqual('hashedValue')
  })
  test('compare method should return true if password match', async () => {
    const sut = new Encrypter()
    jest.spyOn(sut, 'compare').mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(true)
      })
    )
    const valueToCompare = 'any_value'
    const valueSent = 'hashedValue'
    const match = await sut.compare(valueToCompare, valueSent)
    expect(match).toEqual(true)
  })
  test('compare method should return true if password match', async () => {
    const sut = new Encrypter()
    jest.spyOn(sut, 'compare').mockReturnValueOnce(
      new Promise((resolve) => {
        resolve(false)
      })
    )
    const valueToCompare = 'any_value'
    const valueSent = 'hashedValue'
    const match = await sut.compare(valueToCompare, valueSent)
    expect(match).toEqual(false)
  })
})
