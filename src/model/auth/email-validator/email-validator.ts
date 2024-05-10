import { isEmail } from 'validator'

interface emailValidator {
  isValid: (email: string) => boolean
}

export class EmailValidator implements emailValidator {
  isValid (email: string): boolean {
    return isEmail(email)
  }
}
