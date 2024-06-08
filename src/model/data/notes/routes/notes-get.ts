/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable new-cap */

import type { Response } from 'express'
import { notes, type verifyRequest } from '../note-protocols'

export default async function getNotes (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { id } = req.usuario.body
    const notesQuery = new notes()
    const httpResponse = await notesQuery.get({ body: { id } })
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error })
  }
}
