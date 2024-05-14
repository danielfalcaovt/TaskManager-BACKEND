/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import jwt from 'jsonwebtoken'
import { ServerError } from '../login/login-protocols'

interface jwtHandler {
  sign: (id: { id: string }) => string
  verify: (token: string, key: jwt.Secret) => string | jwt.JwtPayload
}

export class JwtHandler implements jwtHandler {
  sign (id: { id: string }): string {
    if (!id) {
      throw new ServerError()
    }
    const token = jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: '8hr' })
    return token
  }

  verify (token: string, key: jwt.Secret): string | jwt.JwtPayload {
    if (!token || !key) {
      return new ServerError()
    }
    const jwtValue = jwt.verify(token, key)
    return jwtValue
  }
}
