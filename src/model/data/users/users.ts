/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/return-await */
// disable @typescript-eslint/no-unused-vars

import { NotFound } from '../../errors/param-not-found'
import { badRequest, ok } from '../../helper/http-helper'
import type { httpRequest, httpResponse } from '../../protocols/http'
import { query } from '../dbConnection'

interface userQueries {
  get: (thtpRequest: httpRequest) => Promise<httpResponse>
}

export class Users implements userQueries {
  async get (httpRequest: httpRequest): Promise<httpResponse> {
    const { id } = httpRequest.body
    const user = await query('SELECT * FROM users WHERE id = $1', [id])
    if (user.rows.length > 0) {
      const { id, username, email } = user.rows[0]
      return new Promise((resolve, reject) => {
        resolve(ok({ id, username, email }))
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(badRequest(new NotFound('Usuário')))
      })
    }
  }
}
