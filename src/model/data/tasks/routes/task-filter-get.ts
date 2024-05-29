import type { Response } from 'express'
import { Task } from '../task'
import type { verifyRequest } from '../task-protocols'

export async function getFilteredTask (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { id } = req.usuario
    const { body } = req
    console.log(body)
    const httpRequest = {
      body: {
        id,
        ...body
      }
    }
    const taskQuery = new Task()
    const httpResponse = await taskQuery.getOne(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
