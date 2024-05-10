/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import bcrypt from 'bcrypt'
import { MissingParamErrorTxt } from '../../errors/missing-param-error'
import { InternalServerErrorTxt } from '../../errors/server-error'

interface encrypter {
  encrypt: (value: string) => Promise<string>
  compare: (value: string, hash: string) => Promise<boolean>
}

export class Encrypter implements encrypter {
  async encrypt (value: string): Promise<string> {
    if (!value) {
      return new Promise((resolve, reject) => {
        reject(MissingParamErrorTxt('value'))
      })
    }
    return new Promise((resolve, reject) => {
      bcrypt.hash(value, 10, (err, hashedValue) => {
        if (err) {
          return reject(InternalServerErrorTxt())
        }
        return resolve(hashedValue)
      })
    })
  }

  async compare (value: string, hash: string): Promise<boolean> {
    if (!value || !hash) {
      return false
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(value, hash, (err, success) => {
        if (err) {
          reject(MissingParamErrorTxt('value'))
        }
        if (success) {
          resolve(success)
        } else {
          resolve(false)
        }
      })
    })
  }
}
