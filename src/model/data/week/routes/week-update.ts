/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Response } from 'express'
import { Week } from '../week'
import type { verifyRequest } from '../week-protocols'

export async function updateWeek (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { id } = req.usuario
    const httpRequest = {
      body: {
        id,
        ...req.body
      }
    }
    const weekQuery = new Week()
    const httpResponse = await weekQuery.update(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
