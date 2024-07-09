import { InvalidParamError } from '../../errors/invalid-param-error'
import { NotFound } from '../../errors/param-not-found'
import { Task } from './task'
import { MissingParamError } from './task-protocols'

const makeSut = (): Task => {
  const sut = new Task()
  return sut
}

describe('Task', () => {
  test('Should return 400 if no id was provided. GET', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        anything: ''
      }
    }
    const httpResponse = await sut.get(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('id').message)
  })
  test('Should return 400 if no id was provided. POST', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        taskTitle: 'any_name',
        taskText: 'any_text',
        taskDay: 'monday'
      }
    }
    const httpResponse = await sut.post(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('id').message)
  })
  test('Should return 400 if no taskTitle was provided. POST', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        id: 'any_id',
        taskText: 'any_text',
        taskDay: 'monday'
      }
    }
    const httpResponse = await sut.post(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('taskTitle').message)
  })
  test('Should return 400 if no taskText was provided. POST', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        id: 'any_id',
        taskTitle: 'any_name',
        taskDay: 'monday'
      }
    }
    const httpResponse = await sut.post(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('taskText').message)
  })
  test('Should return 400 if no taskDay was provided. POST', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        id: 'any_id',
        taskText: 'any_text',
        taskTitle: 'any_name'
      }
    }
    const httpResponse = await sut.post(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('taskDay').message)
  })
  test('Should return 400 if invalid day was provided. POST', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        id: 'any_id',
        taskTitle: 'any_name',
        taskMonth: 'any_month',
        taskText: 'any_text',
        taskDay: 'invalid_day'
      }
    }
    const httpResponse = await sut.post(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('dia').message)
  })
  test('Should return 400 if no id was provided. UPDATE', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        taskId: 'any_id'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('id').message)
  })
  test('Should return 400 if no taskId was provided. UPDATE', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        id: 'any_id'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('taskId').message)
  })
  test('Should return 400 if no param was provided. UPDATE', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        id: 'another_id',
        taskId: 'any_id'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NotFound('Parâmetro').message)
  })
  test('Should return 400 if invalid day param was provided. UPDATE', async () => {
    const sut = makeSut()
    const httpRequest = {
      body: {
        id: 'another_id',
        taskId: 'any_id',
        taskDay: 'invalid_day'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('dia').message)
  })
})
