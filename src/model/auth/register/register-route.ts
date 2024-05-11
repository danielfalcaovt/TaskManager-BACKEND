/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Request, Response } from 'express'
import { Encrypter, EmailValidator } from './register-protocols'
import { register } from './register'

export async function registerRoute (req: Request, res: Response): Promise<any> {
  try {
    const { body } = req
    const httpRequest = {
      body
    }
    const emailValidator = new EmailValidator()
    const encrypter = new Encrypter()
    const registerQuery = new register(emailValidator, encrypter)
    const httpResponse = await registerQuery.registerUser(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error)
  }
}
