import type { Response } from 'express'
import type { newRequest } from '../../data/notes/routes/notes-post'
import { ForgotPassword } from './forgotPassword'

export default async function ConfirmPasswordRoute (req: newRequest, res: Response): Promise<any> {
  try {
    const { email, code } = req.body
    const httpRequest = {
      body: {
        code,
        email
      }
    }
    const fPasswordQuery = new ForgotPassword()
    const httpResponse = await fPasswordQuery.confirm(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
