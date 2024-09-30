/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Response } from 'express'
import { Task } from '../task'
import type { verifyRequest } from '../task-protocols'

export async function deleteAllTasks (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { userId, sure } = req.params
    const httpRequest = {
      body: {
        userId,
        sure
      }
    }
    const taskQuery = new Task()
    const httpResponse = await taskQuery.deleteAll(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
