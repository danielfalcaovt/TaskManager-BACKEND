/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/return-await */

import { NotFound } from '../../errors/param-not-found'
import { badRequest, ok } from '../../helper/http-helper'
import type { httpResponse, httpRequest } from '../../protocols/http'
import { MissingParamError, ServerError, query } from '../notes/note-protocols'

interface week {
  get: (httpRequest: httpRequest) => Promise<httpResponse>
  post: (id: string) => Promise<httpResponse>
/*   update: (httpRequest: httpRequest) => Promise<httpResponse>
  delete: (httpRequest: httpRequest) => Promise<httpResponse> */
}

export class Week implements week {
  async get (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = [
      'id'
    ]
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id } = httpRequest.body

    const userWeekDays = await query('SELECT * FROM week WHERE user_id = $1', [id])
    if (userWeekDays.rows.length > 0) {
      return new Promise(resolve => {
        resolve(ok(userWeekDays.rows))
      })
    } else {
      return new Promise(resolve => [
        resolve(badRequest(new NotFound('week')))
      ])
    }
  }

  async post (id: string): Promise<httpResponse> {
    if (!id) {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
    const checkIfUserAlreadyHasWeek = await query('SELECT * FROM week WHERE user_id = $1', [id])
    if (checkIfUserAlreadyHasWeek.rows.length > 0) {
      return new Promise(resolve => {
        resolve(badRequest(new Error('Semana já existente.')))
      })
    }

    const queryResult = await query('INSERT INTO week(user_id) VALUES ($1) RETURNING *', [id])
    if (queryResult.rows.length > 0) {
      return new Promise(resolve => {
        resolve(ok(queryResult.rows))
      })
    } else {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
  }
}
