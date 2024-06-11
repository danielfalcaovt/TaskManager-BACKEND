/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Request, Response } from 'express'
import { notes } from '../note-protocols'

interface newRequest extends Request {
  usuario: any
}

export async function patchNotes (req: newRequest, res: Response): Promise<any> {
  try {
    const { body } = req
    const noteQueries = new notes()
    const httpRequest = {
      body
    }
    const httpResponse = await noteQueries.update(httpRequest)
    console.log(httpResponse)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
