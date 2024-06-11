/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import type { Request, Response } from 'express'
import { notes } from '../notes'

export async function deleteNotes (req: Request, res: Response): Promise<any> {
  try {
    const { userId, noteId } = req.params
    const httpRequest = {
      body: {
        userId,
        noteId
      }
    }
    const noteQueries = new notes()
    const httpResponse = await noteQueries.delete(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
