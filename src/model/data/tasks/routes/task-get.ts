import type { Response } from 'express'
import { Task } from '../task'
import type { verifyRequest } from '../task-protocols'

export async function getTasks (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { id } = req.usuario
    const httpRequest = {
      body: {
        id
      }
    }
    const taskQuery = new Task()
    const httpResponse = await taskQuery.get(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error)
  }
}
