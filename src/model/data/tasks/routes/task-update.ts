/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Response } from 'express'
import { Task } from '../task'
import type { verifyRequest } from '../task-protocols'

export async function updateWeek (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { id } = req.usuario
    const httpRequest = {
      body: {
        id,
        ...req.body
      }
    }
    const taskQuery = new Task()
    const httpResponse = await taskQuery.update(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
