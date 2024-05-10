/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/return-await */

import { NotFound } from '../../errors/param-not-found'
import { badRequest, ok } from '../../helper/http-helper'
import type { httpRequest, httpResponse } from '../../protocols/http'
import { MissingParamError, ServerError, query } from './note-protocols'

interface noteQueries {
  get: (httpRequest: httpRequest) => Promise<httpResponse>
  post: (httpRequest: httpRequest) => Promise<httpResponse>
  delete: (httpRequest: httpRequest) => Promise<httpResponse>
  update: (httpRequest: httpRequest) => Promise<httpResponse>
}

export interface noteType {
  noteTitle: string
  noteText: string
  userId: string
}
export interface noteSent extends noteType {
  noteId: string
  timeWasSent: string
}

export class notes implements noteQueries {
  async get (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['id']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }

    const { ...user } = httpRequest.body

    const allNotes = await query('SELECT * FROM notes WHERE user_id = $1', [
      user.id
    ])
    if (allNotes.rows.length > 0) {
      return new Promise((resolve, reject) => {
        resolve(ok(allNotes.rows))
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(badRequest(new NotFound('notes')))
      })
    }
  }

  async post (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['noteTitle', 'noteText', 'userId']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }

    const { ...note } = httpRequest.body

    const whenWasSentTheNote = Date.now()
    const queryResult = await query('INSERT INTO notes(note_title, note_text, user_id, when_was_sent) VALUES($1,$2,$3,$4) RETURNING *', [note.noteTitle, note.noteText, note.userId, String(whenWasSentTheNote)])
    if (queryResult.rows.length > 0) {
      return new Promise((resolve, reject) => {
        resolve(ok(queryResult.rows[0]))
      })
    } else {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
  }

  async delete (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['noteId', 'userId']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { ...note } = httpRequest.body

    const checkIfExist = await query('SELECT * FROM notes WHERE note_id = $1 AND user_id = $2', [note.noteId, note.userId])
    if (checkIfExist.rows.length === 0) {
      return new Promise(resolve => {
        resolve(badRequest(new NotFound('note')))
      })
    }
    const deletedNote = await query('DELETE FROM notes WHERE note_id = $1 AND user_id = $2 RETURNING *', [note.noteId, note.userId])
    if (deletedNote.rows.length > 0) {
      return new Promise((resolve, reject) => {
        resolve(ok(deletedNote.rows[0]))
      })
    } else {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
  }

  async update (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['noteId', 'userId']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }

    const { ...note } = httpRequest.body
    if (!note.noteText && !note.noteTitle) {
      return new Promise(resolve => {
        resolve(badRequest(new NotFound('note')))
      })
    }

    const checkIfExist = await query('SELECT * FROM notes WHERE note_id = $1 AND user_id = $2', [note.noteId, note.userId])
    if (checkIfExist.rows.length > 0) {
      let queries = ''
      const valuesProvided: string[] = []
      let queryCount = 0

      if (note.noteText) {
        if (queryCount > 0) {
          queries += ', '
        }
        valuesProvided.push(note.noteText)
        queryCount++
        queries += `note_text = $${queryCount}`
      }

      if (note.noteTitle) {
        if (queryCount > 0) {
          queries += ', '
        }
        valuesProvided.push(note.noteTitle)
        queryCount++
        queries += `note_title = $${queryCount}`
      }

      const updatedNote = await query(`UPDATE notes SET ${queries} WHERE note_id = '${note.noteId}' RETURNING *`, valuesProvided)
      if (updatedNote.rows.length > 0) {
        return new Promise(resolve => {
          resolve(ok(updatedNote.rows[0]))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(new ServerError())
        })
      }
    } else {
      return new Promise(resolve => {
        resolve(badRequest(new NotFound('notes'))) // NOTA NÃO ENCONTRADA
      })
    }
  }
}
