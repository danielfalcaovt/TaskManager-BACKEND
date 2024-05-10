/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { NotFound } from '../../errors/param-not-found'
import { authError, badRequest, ok } from '../../helper/http-helper'
import type { httpRequest, httpResponse } from '../../protocols/http'
import { EmailValidator, Encrypter, InvalidParamError, MissingParamError, query } from './login-protocols'
import jwt from 'jsonwebtoken'

interface login {
  authenticate: (httpRequest: httpRequest) => Promise<httpResponse>
}

export class Login implements login {
  async authenticate (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['email', 'password']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }

    const { email, password } = httpRequest.body

    const emailValidator = new EmailValidator()
    if (!emailValidator.isValid(email)) {
      return new Promise(resolve => {
        resolve(badRequest(new InvalidParamError('email')))
      })
    }

    const checkIfUserExist = await query('SELECT * FROM users WHERE email = $1', [email])
    if (checkIfUserExist.rows.length > 0) {
      const { password: hashedPassword } = checkIfUserExist.rows[0]
      const encrypter = new Encrypter()
      const passwordMatch = await encrypter.compare(password, hashedPassword)
      if (passwordMatch) {
        const { password, ...user } = checkIfUserExist.rows[0]
        const token = jwt.sign({ id: user.id }, process.env.JWT_TOKEN, {
          expiresIn: '8hr'
        })
        return new Promise(resolve => {
          resolve(ok({ user, token }))
        })
      } else {
        return new Promise(resolve => {
          resolve(authError())
        })
      }
    } else {
      return new Promise(resolve => {
        resolve(badRequest(new NotFound('user')))
      })
    }
  }
}
