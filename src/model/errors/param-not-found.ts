export class NotFound extends Error {
  constructor (paramName: string) {
    super(`${paramName} não encontrado.`)
    this.name = 'NotFound'
  }
}
