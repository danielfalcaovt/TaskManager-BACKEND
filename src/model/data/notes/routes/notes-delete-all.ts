/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Response } from 'express'
import type { verifyRequest } from '../note-protocols'
import { notes } from '../notes'

export async function deleteAllNotes (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { id } = req.query
    const httpRequest = {
      body: {
        id
      }
    }
    const noteQuery = new notes()
    const httpResponse = await noteQuery.deleteAll(httpRequest)
    console.log(httpResponse)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    return res.status(500).json(error.message)
  }
}
