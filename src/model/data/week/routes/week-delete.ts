/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Response } from 'express'
import { Week } from '../week'
import type { verifyRequest } from '../week-protocols'

export async function deleteWeek (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { id } = req.usuario
    const { dayOfWeek } = req.body
    const httpRequest = {
      body: {
        id,
        dayOfWeek
      }
    }
    const weekQuery = new Week()
    const httpResponse = await weekQuery.delete(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
