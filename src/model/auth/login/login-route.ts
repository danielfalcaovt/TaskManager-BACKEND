/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Request, Response } from 'express'
import { Login } from './login'
import { EmailValidator } from './login-protocols'

export async function loginRoute (req: Request, res: Response): Promise<any> {
  try {
    const { body } = req
    const httpRequest = {
      body
    }
    const emailValidator = new EmailValidator()
    const loginQuery = new Login(emailValidator)
    const httpResponse = await loginQuery.authenticate(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
