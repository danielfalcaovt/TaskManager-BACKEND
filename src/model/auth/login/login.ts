/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { NotFound } from '../../errors/param-not-found'
import { authError, badRequest, ok, serverError } from '../../helper/http-helper'
import type { httpRequest, httpResponse } from '../../protocols/http'
import type { JwtHandler } from '../jwt/jwt'
import {
  type EmailValidator,
  type Encrypter,
  InvalidParamError,
  MissingParamError,
  query
} from './login-protocols'

interface login {
  authenticate: (httpRequest: httpRequest) => Promise<httpResponse>
}

export class Login implements login {
  private readonly emailValidator: EmailValidator
  private readonly encrypter: Encrypter
  private readonly jwtHandler: JwtHandler

  constructor (emailValidator: EmailValidator, encrypter: Encrypter, jwtHandler: JwtHandler) {
    this.emailValidator = emailValidator
    this.encrypter = encrypter
    this.jwtHandler = jwtHandler
  }

  async authenticate (httpRequest: httpRequest): Promise<httpResponse> {
    try {
      const requiredParameters = ['email', 'password']
      for (const pos of requiredParameters) {
        if (!httpRequest.body[pos]) {
          return new Promise((resolve) => {
            resolve(badRequest(new MissingParamError(pos)))
          })
        }
      }

      const { email, password } = httpRequest.body

      if (!this.emailValidator.isValid(email)) {
        return new Promise((resolve) => {
          resolve(badRequest(new InvalidParamError('email')))
        })
      }

      const checkIfUserExist = await query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      )
      if (checkIfUserExist.rows.length > 0) {
        const { password: hashedPassword } = checkIfUserExist.rows[0]
        const passwordMatch = await this.encrypter.compare(password, hashedPassword)
        if (passwordMatch) {
          const { password, ...user } = checkIfUserExist.rows[0]
          const token = this.jwtHandler.sign({ id: user.id })
          return new Promise((resolve) => {
            resolve(ok({ user, token }))
          })
        } else {
          return new Promise((resolve) => {
            resolve(authError())
          })
        }
      } else {
        return new Promise((resolve) => {
          resolve(badRequest(new NotFound('user')))
        })
      }
    } catch (error) {
      return serverError()
    }
  }
}
