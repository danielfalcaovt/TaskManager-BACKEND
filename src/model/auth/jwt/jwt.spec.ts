import { JwtHandler } from './jwt'

describe('JwtHandler', () => {
  test('Should return jwt if ok', () => {
    const sut = new JwtHandler()
    jest.spyOn(sut, 'sign').mockReturnValueOnce('valid_jwt')
    const jwtResponse = sut.sign({ id: 'valid_id' })
    expect(jwtResponse).toEqual('valid_jwt')
  })
})
