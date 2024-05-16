export const InvalidParamErrorTxt = (paramName: string): string => {
  return `Parâmetro ${paramName} inválido.`
}

export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Parâmetro ${paramName} inválido.`)
    this.name = 'InvalidParam'
  }
}
