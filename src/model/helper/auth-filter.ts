/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import jwt from 'jsonwebtoken'
import type { NextFunction, Request, Response } from 'express'
import { users } from '../data/users/users'
import * as dotenv from 'dotenv'
dotenv.config()

export interface verifyRequest extends Request {
  usuario: any
}

export const verifyUser = async (req: verifyRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      return res.status(300).json({ error: 'Usuário não autênticado.' })
    }
    const token = authorization.replace('Bearer ', '')
    const user: any = jwt.verify(token, process.env.JWT_TOKEN)
    const userQuery = new users()
    const foundUser = await userQuery.get(user.id)
    if (foundUser) {
      req.usuario = foundUser
      next()
    } else {
      return res.status(300).json({ error: 'Usuário não encontrado.' })
    }
  } catch (error) {
    return res.status(500).json({ error: 'Erro no Servidor Interno.' })
  }
}
