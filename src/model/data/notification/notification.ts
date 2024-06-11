/* eslint-disable @typescript-eslint/return-await */
import { NotFound } from '../../errors/param-not-found'
import { badRequest, ok } from '../../helper/http-helper'
import type { httpRequest, httpResponse } from '../../protocols/http'
import { query } from '../dbConnection'

interface notification {
  get: (httpRequest: httpRequest) => Promise<httpResponse>
}

export class Notification implements notification {
  async get (): Promise<httpResponse> {
    const dbResponse = await query('SELECT * FROM notifications')
    if (dbResponse.rows.length > 0) {
      return new Promise(resolve => {
        resolve(ok(dbResponse.rows))
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve(badRequest(new NotFound('Notificação')))
      })
    }
  }
}
