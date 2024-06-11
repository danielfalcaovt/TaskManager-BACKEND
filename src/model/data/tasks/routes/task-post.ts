import type { Response } from 'express'
import { Task } from '../task'
import type { newRequest } from '../../notes/routes/notes-post'

export async function postTask (req: newRequest, res: Response): Promise<any> {
  try {
    const { id } = req.usuario.body
    const { body } = req
    const httpRequest = {
      body: {
        id,
        ...body
      }
    }
    const taskQuery = new Task()
    const httpResponse = await taskQuery.post(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
