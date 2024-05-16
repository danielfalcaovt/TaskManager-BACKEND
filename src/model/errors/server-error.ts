export const InternalServerErrorTxt = (): string => {
  return 'Internal Server Error'
}

export class ServerError extends Error {
  constructor () {
    super('Erro no Servidor Interno.')
    this.name = 'ServerError'
  }
}
