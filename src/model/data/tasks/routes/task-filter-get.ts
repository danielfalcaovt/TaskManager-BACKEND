import type { Response } from 'express'
import { Task } from '../task'

export async function getFilteredTask (req: Request, res: Response): Promise<any> {
  try {
    const { body } = req
    const httpRequest = {
      body: {
        ...body
      }
    }
    const taskQuery = new Task()
    const httpResponse = await taskQuery.getOne(httpRequest)
    console.log(httpResponse)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
