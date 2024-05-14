/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Request, Response } from 'express'
import { Login } from './login'
import { EmailValidator, Encrypter } from './login-protocols'
import { JwtHandler } from '../jwt/jwt'

export async function loginRoute (req: Request, res: Response): Promise<any> {
  try {
    const { body } = req
    const httpRequest = {
      body
    }
    const emailValidator = new EmailValidator()
    const encrypter = new Encrypter()
    const jwtHandler = new JwtHandler()
    const loginQuery = new Login(emailValidator, encrypter, jwtHandler)
    const httpResponse = await loginQuery.authenticate(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
