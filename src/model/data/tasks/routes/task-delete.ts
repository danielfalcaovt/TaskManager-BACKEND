/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Response } from 'express'
import { Task } from '../task'
import type { verifyRequest } from '../task-protocols'

export async function deleteWeek (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { userId, taskId } = req.params
    const httpRequest = {
      body: {
        userId,
        taskId
      }
    }
    const taskQuery = new Task()
    const httpResponse = await taskQuery.delete(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
