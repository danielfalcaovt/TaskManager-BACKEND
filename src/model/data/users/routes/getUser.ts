/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { type Response } from 'express'
import { type verifyRequest } from '../../notes/note-protocols'
import { Users } from '../users'

export default async function getUser (req: verifyRequest, res: Response): Promise<any> {
  try {
    const { id } = req.usuario.body
    const usersQuery = new Users()
    const httpRequest = {
      body: {
        id
      }
    }
    const httpResponse = await usersQuery.get(httpRequest)
    return res.status(200).json(httpResponse.body)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
