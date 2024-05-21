/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/return-await */
import { EmailSender } from '../../../utils/email-sender/emailSender'
import { badRequest, ok, serverError } from '../../helper/http-helper'
import type { httpRequest, httpResponse } from '../../protocols/http'
import { InvalidParamError, MissingParamError, query } from '../login/login-protocols'

export interface forgotPassword {
  forgot: (httpRequest: httpRequest) => Promise<httpResponse>
  confirm: (httpRequest: httpRequest) => Promise<httpResponse>
}

export class ForgotPassword implements forgotPassword {
  async forgot (httpRequest: httpRequest): Promise<httpResponse> {
    try {
      const { email } = httpRequest.body
      const checkIfIsUserEmail = await query('SELECT * FROM users WHERE email = $1', [email])
      if (checkIfIsUserEmail.rows.length > 0) {
        const randomKeyToConfirmInUserEmail = String(Math.floor(Math.random() * 900000) + 100000)
        const emailSender = new EmailSender()
        const emailToSendToUser = {
          to: email,
          from: 'deenedev@gmail.com',
          subject: 'Password Recovery',
          text: `
          Do not share that code with anyone.
          CODE: ${randomKeyToConfirmInUserEmail}
          `
        }
        await emailSender.sendEmail(emailToSendToUser)
        const codeInsertedInDatabase = await query('UPDATE users SET forgotPasswordCode = $1 WHERE email = $2 RETURNING *', [randomKeyToConfirmInUserEmail, email])
        if (codeInsertedInDatabase.rows.length > 0) {
          return new Promise((resolve) => {
            resolve(ok('Successfully sent'))
          })
        } else {
          return new Promise((resolve, reject) => {
            reject(serverError())
          })
        }
      } else {
        return await new Promise((resolve) => {
          resolve(badRequest(new InvalidParamError('email')))
        })
      }
    } catch (error) {
      return await new Promise((resolve, reject) => {
        reject(error)
      })
    }
  }

  async confirm (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['email', 'code']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise((resolve) => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { email, code } = httpRequest.body
    const checkCodeInDB = await query('SELECT * FROM users WHERE email = $1 AND forgotPasswordCode = $2', [email, code])
    if (checkCodeInDB.rows.length > 0) {
      await query('UPDATE users SET forgotPasswordCode = NULL WHERE id = $1', [checkCodeInDB.rows[0].id])
      return new Promise((resolve) => {
        resolve(ok(checkCodeInDB.rows))
      })
    } else {
      return new Promise((resolve) => {
        resolve(badRequest(new InvalidParamError('code')))
      })
    }
  }
}
