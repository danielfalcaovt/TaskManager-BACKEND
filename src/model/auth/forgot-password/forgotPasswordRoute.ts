import type { Response } from 'express'
import type { newRequest } from '../../data/notes/routes/notes-post'
import { ForgotPassword } from './forgotPassword'

export default async function ForgotPasswordRoute (req: newRequest, res: Response): Promise<any> {
  try {
    const { email } = req.body
    const httpRequest = {
      body: {
        email
      }
    }
    const fPasswordQuery = new ForgotPassword()
    const httpResponse = await fPasswordQuery.forgot(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
