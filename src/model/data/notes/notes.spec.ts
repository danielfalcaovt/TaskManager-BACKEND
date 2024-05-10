/* eslint-disable new-cap */
import { NotFound } from '../../errors/param-not-found'
import type { httpRequest } from '../../protocols/http'
import { MissingParamError } from './note-protocols'
import { notes } from './notes'

const makeSut = (): notes => {
  const sut = new notes()
  return sut
}

describe('notes', () => {
  test('Should return 400 if no id provided on get route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        username: 'deenedev'
      }
    }
    const httpResponse = await sut.get(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('id').message)
  })
  test('Should return 400 if no noteTitle provided on post route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        noteText: 'any_text',
        userId: 'any_id'
      }
    }
    const httpResponse = await sut.post(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('noteTitle').message)
  })
  test('Should return 400 if no noteText provided on post route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        noteTitle: 'any_title',
        userId: 'any_id'
      }
    }
    const httpResponse = await sut.post(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('noteText').message)
  })
  test('Should return 400 if no userId provided on post route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        noteTitle: 'any_title',
        noteText: 'any_id'
      }
    }
    const httpResponse = await sut.post(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('userId').message)
  })
  test('Should return 400 if no noteId provided on update route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        userId: 'any_id'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('noteId').message)
  })
  test('Should return 400 if no userId provided on update route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        noteId: 'any_id'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('userId').message)
  })
  test('Should return 400 if any param to change was not provided on update route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        noteId: 'any_noteId',
        userId: 'any_userId'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NotFound('note').message)
  })
  test('Should return 400 if no userId provided on delete route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        noteId: 'any_noteId'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('userId').message)
  })
  test('Should return 400 if no userId provided on delete route.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        userId: 'any_userId'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('noteId').message)
  })
  test('Should return 400 if no note was found.', async () => {
    const sut = makeSut()
    const httpRequest: httpRequest = {
      body: {
        userId: 'inexistentId',
        noteId: 'inexistentId'
      }
    }
    const httpResponse = await sut.update(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new NotFound('note').message)
  })
})
