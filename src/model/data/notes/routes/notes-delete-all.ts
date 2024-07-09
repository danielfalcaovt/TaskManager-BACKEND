/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Response } from 'express'
import type { verifyRequest } from '../note-protocols'
import { notes } from '../notes'

export async function deleteAllNotes (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { userId, sure } = req.params
    const httpRequest = {
      body: {
        userId,
        sure
      }
    }
    const noteQuery = new notes()
    const httpResponse = await noteQuery.deleteAll(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
