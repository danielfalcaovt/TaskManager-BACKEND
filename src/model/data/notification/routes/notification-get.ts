import type { Request, Response } from 'express'
import { Notification } from '../notification'

export async function getNotification (req: Request, res: Response): Promise<any> {
  try {
    const notificationQuery = new Notification()
    const httpResponse = await notificationQuery.get()
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error)
  }
}
