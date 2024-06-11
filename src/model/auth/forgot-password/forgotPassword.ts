/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/return-await */
import { EmailSender } from '../../../utils/email-sender/emailSender'
import { authError, badRequest, ok } from '../../helper/http-helper'
import type { httpRequest, httpResponse } from '../../protocols/http'
import { InvalidParamError, MissingParamError, ServerError, query } from '../login/login-protocols'
import bcrypt from 'bcrypt'
import { GenerateTimeInUnix } from './expiration-time-in-unix/exp-time-in-unix'

export interface forgotPassword {
  forgot: (httpRequest: httpRequest) => Promise<httpResponse>
  confirm: (httpRequest: httpRequest) => Promise<httpResponse>
}

export class ForgotPassword implements forgotPassword {
  async forgot (httpRequest: httpRequest): Promise<httpResponse> {
    try {
      const { email } = httpRequest.body
      if (!email) {
        return new Promise((resolve) => {
          resolve(badRequest(new MissingParamError('email')))
        })
      }
      const checkIfIsUserEmail = await query('SELECT * FROM users WHERE email = $1', [email])
      if (checkIfIsUserEmail.rows.length > 0) {
        const randomKeyToConfirmInUserEmail = String(Math.floor(Math.random() * 900000) + 100000)
        return new Promise((resolve, reject) => {
          const expirationTimeGenerator = new GenerateTimeInUnix()
          const unixExpTime = expirationTimeGenerator.generate()
          bcrypt.hash(randomKeyToConfirmInUserEmail, 10, async (err, hash) => {
            if (err) {
              reject(err)
            }
            const emailSender = new EmailSender()
            const emailToSendToUser = {
              to: email,
              from: 'deenedev@gmail.com',
              subject: 'Password Recovery',
              text: `
              Do not share this code with anyone
              Recovery Code: ${randomKeyToConfirmInUserEmail}
              `
            }
            console.log(randomKeyToConfirmInUserEmail)
            await emailSender.sendEmail(emailToSendToUser)
            const codeInsertedInDatabase = await query('UPDATE users SET forgotpasswordcode = $1, expirationtimeinunix = $2 WHERE email = $3 RETURNING *', [hash, unixExpTime, email])
            if (codeInsertedInDatabase.rows.length > 0) {
              resolve(ok('You will receive a recovery code in your email in next 3 minutes.'))
            } else {
              reject(new ServerError())
            }
          })
        })
      } else {
        return new Promise((resolve) => {
          resolve(badRequest(new InvalidParamError('email')))
        })
      }
    } catch (error) {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
  }

  async confirm (httpRequest: httpRequest): Promise<httpResponse> {
    try {
      const requiredParameters = ['email', 'code']
      console.log(httpRequest.body)
      for (const pos of requiredParameters) {
        if (!httpRequest.body[pos]) {
          return new Promise((resolve) => {
            resolve(badRequest(new MissingParamError(pos)))
          })
        }
      }
      const { email, code } = httpRequest.body
      const checkCodeInDB = await query('SELECT * FROM users WHERE email = $1', [email])
      if (checkCodeInDB.rows.length > 0) {
        const { forgotpasswordcode, expirationtimeinunix } = checkCodeInDB.rows[0]
        console.log(forgotpasswordcode)
        console.log(expirationtimeinunix)
        if (!forgotpasswordcode || !expirationtimeinunix) {
          return new Promise((resolve, reject) => {
            reject(new ServerError())
          })
        }
        const actuallyDay = new Date()
        const expirationDay = new Date(expirationtimeinunix)
        if (actuallyDay >= expirationDay) {
          return new Promise((resolve, reject) => {
            resolve(authError(new Error('Não autorizado')))
          })
        }
        return new Promise((resolve, reject) => {
          bcrypt.compare(code, forgotpasswordcode, async (err, check) => {
            if (err) {
              console.log(err)
              reject(new ServerError())
            }
            if (!check) {
              resolve(badRequest(new InvalidParamError('code')))
            } else {
              await query('UPDATE users SET forgotpasswordcode = NULL, expirationtimeinunix = NULL WHERE id = $1', [checkCodeInDB.rows[0].id])
              resolve(ok(checkCodeInDB.rows))
            }
          })
        })
      } else {
        return new Promise((resolve) => {
          resolve(badRequest(new InvalidParamError('code')))
        })
      }
    } catch (error) {
      console.log(error)
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
  }
}
