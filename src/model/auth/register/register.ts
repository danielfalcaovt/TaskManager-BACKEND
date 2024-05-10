/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type { Request, Response } from 'express'
import { Encrypter, EmailValidator, query, InternalServerErrorTxt, InvalidParamErrorTxt, MissingParamErrorTxt } from './register-protocols'

export async function register (req: Request, res: Response): Promise<any> {
  try {
    const { body } = req

    const requiredParameters = [
      'username',
      'email',
      'password',
      'confirmPassword'
    ]
    for (const pos of requiredParameters) {
      if (!body[pos]) {
        return res.status(400).json({ error: MissingParamErrorTxt(pos) })
      }
    }

    const { username, email, password, confirmPassword } = req.body

    const emailValidator = new EmailValidator()
    if (!emailValidator.isValid(email)) {
      return res.status(400).json({ error: InvalidParamErrorTxt('email') })
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: 'As senhas devem ser exatamente iguais.' })
    }

    const encrypter = new Encrypter()
    const hashedPassword = await encrypter.encrypt(password)

    const checkIfUserExist = await query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    )
    if (checkIfUserExist.rows.length > 0) {
      return res.status(400).json({ error: 'Usuário já existente.' })
    } else {
      const insertUserAndReturnIfSuccess = await query(
        'INSERT INTO users(username, email, password) VALUES($1,$2,$3) RETURNING *',
        [username, email, hashedPassword]
      )
      if (insertUserAndReturnIfSuccess.rows.length > 0) {
        const user = insertUserAndReturnIfSuccess.rows[0]
        res.status(200).json({ user })
      } else {
        throw new Error()
      }
    }
  } catch (error) {
    return res.status(500).json({ error: InternalServerErrorTxt() })
  }
}
