export const MissingParamErrorTxt = (paramName: string): string => {
  return `Missing ${paramName} param.`
}

export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing ${paramName} param.`)
    this.name = 'MissingParam'
  }
}
