/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/return-await */
// disable @typescript-eslint/no-unused-vars

import { query } from '../dbConnection'
import type { user } from './user-protocols'

interface userQueries {
  get: (id: string) => Promise<user | string>
}

export class users implements userQueries {
  async get (id: string): Promise<user | string> {
    const user = await query('SELECT * FROM users WHERE id = $1', [id])
    if (user.rows.length > 0) {
      const userFound = user.rows[0]
      return new Promise((resolve, reject) => {
        resolve(userFound)
      })
    } else {
      return new Promise((resolve, reject) => {
        resolve('Usuário não encontrado.')
      })
    }
  }
}
