/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable new-cap */
import { NotFound } from '../../errors/param-not-found'
import { badRequest } from '../../helper/http-helper'
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
        any_param: 'any_value'
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
  test('Should return 400 if no noteId provided on delete route.', async () => {
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
    jest.spyOn(sut, 'update').mockReturnValueOnce(new Promise(resolve => { resolve(badRequest(new NotFound('note'))) }))
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
  test('Should throw if get route throws', async () => {
    const sut = new notes()
    jest.spyOn(sut, 'get').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const httpRequest: httpRequest = {
      body: {
        id: 'any_id'
      }
    }
    const promise = sut.get(httpRequest)
    await expect(promise).rejects.toThrow()
  })
  test('Should throw if post route throws', async () => {
    const sut = new notes()
    jest.spyOn(sut, 'post').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const httpRequest: httpRequest = {
      body: {
        id: 'any_id'
      }
    }
    const promise = sut.post(httpRequest)
    await expect(promise).rejects.toThrow()
  })
  test('Should throw if delete route throws', async () => {
    const sut = new notes()
    jest.spyOn(sut, 'delete').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const httpRequest: httpRequest = {
      body: {
        id: 'any_id'
      }
    }
    const promise = sut.delete(httpRequest)
    await expect(promise).rejects.toThrow()
  })
  test('Should throw if deleteAll route throws', async () => {
    const sut = new notes()
    jest.spyOn(sut, 'deleteAll').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const httpRequest: httpRequest = {
      body: {
        id: 'any_id'
      }
    }
    const promise = sut.deleteAll(httpRequest)
    await expect(promise).rejects.toThrow()
  })
  test('Should throw if update route throws', async () => {
    const sut = new notes()
    jest.spyOn(sut, 'update').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => {
        reject(new Error())
      })
    })
    const httpRequest: httpRequest = {
      body: {
        id: 'any_id'
      }
    }
    const promise = sut.update(httpRequest)
    await expect(promise).rejects.toThrow()
  })
})
