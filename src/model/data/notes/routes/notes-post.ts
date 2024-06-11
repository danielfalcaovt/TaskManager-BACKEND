/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Request, Response } from 'express'
import { notes } from '../note-protocols'

export interface newRequest extends Request {
  usuario: any
}

export async function postNotes (req: newRequest, res: Response): Promise<any> {
  try {
    const { body } = req
    body.userId = req.usuario.body.id
    const httpRequest = {
      body
    }
    const noteQueries = new notes()
    const httpResponse = await noteQueries.post(httpRequest)
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.error(error)
    return res.status(500).json(error)
  }
}
