export const InvalidParamErrorTxt = (paramName: string): string => {
  return `Invalid ${paramName} param has been provided.`
}

export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid ${paramName} param.`)
    this.name = 'InvalidParam'
  }
}
