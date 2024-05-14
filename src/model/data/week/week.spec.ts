import { Week } from './week'
import { MissingParamError } from './week-protocols'

describe('Week Controller', () => {
  test('Should return 400 if no id was provided to get route.', async () => {
    const sut = new Week()
    const httpRequest = {
      body: {
        param: ''
      }
    }
    const httpResponse = await sut.get(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('id').message)
  })
  test('Should return 400 if no id was provided to update route.', async () => {
    const sut = new Week()
    const httpRequest = {
      body: {
        param: ''
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('id').message)
  })
  test('Should return 400 if no id was provided to delete route.', async () => {
    const sut = new Week()
    const httpRequest = {
      body: {
        param: ''
      }
    }
    const httpResponse = await sut.delete(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('id').message)
  })
  test('Should return 400 if no dayOfWeek was provided to delete route.', async () => {
    const sut = new Week()
    const httpRequest = {
      body: {
        id: 'any_id'
      }
    }
    const httpResponse = await sut.delete(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('dayOfWeek').message)
  })
})
