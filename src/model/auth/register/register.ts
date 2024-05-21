/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { badRequest, ok, serverError } from '../../helper/http-helper'
import type { httpRequest, httpResponse } from '../../protocols/http'
import { type EmailValidator, type Encrypter, InvalidParamError, MissingParamError, query } from './register-protocols'

interface Register {
  registerUser: (httpRequest: httpRequest) => Promise<httpResponse>
}

export class register implements Register {
  private readonly emailValidator: EmailValidator
  private readonly encrypter: Encrypter

  constructor (emailValidator: EmailValidator, encrypter: Encrypter) {
    this.emailValidator = emailValidator
    this.encrypter = encrypter
  }

  async registerUser (httpRequest: httpRequest): Promise<httpResponse> {
    try {
      const requiredParameters = [
        'username',
        'email',
        'password',
        'confirmPassword'
      ]
      for (const pos of requiredParameters) {
        if (!httpRequest.body[pos] || httpRequest.body[pos].length === 0) {
          return new Promise(resolve => {
            resolve(badRequest(new MissingParamError(pos)))
          })
        }
      }

      const { username, email, password, confirmPassword } = httpRequest.body

      if (!this.emailValidator.isValid(email)) {
        return new Promise(resolve => {
          resolve(badRequest(new InvalidParamError('email')))
        })
      }

      if (password !== confirmPassword) {
        return new Promise(resolve => {
          resolve(badRequest(new InvalidParamError('confirmPassword')))
        })
      }

      const hashedPassword = await this.encrypter.encrypt(password)

      const checkIfUserExist = await query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [username, email]
      )
      if (checkIfUserExist.rows.length > 0) {
        return new Promise(resolve => {
          resolve(badRequest(new Error('Usuário já existente.')))
        })
      } else {
        const insertUserAndReturnIfSuccess = await query(
          'INSERT INTO users(username, email, password) VALUES($1,$2,$3) RETURNING *',
          [username, email, hashedPassword]
        )
        if (insertUserAndReturnIfSuccess.rows.length > 0) {
          const user = insertUserAndReturnIfSuccess.rows[0]
          return new Promise(resolve => {
            resolve(ok(user))
          })
        } else {
          throw new Error()
        }
      }
    } catch (error) {
      console.log(error)
      return serverError()
    }
  }
}
