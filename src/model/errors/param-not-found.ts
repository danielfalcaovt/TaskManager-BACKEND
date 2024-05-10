export class NotFound extends Error {
  constructor (paramName: string) {
    super(`${paramName} not found.`)
    this.name = 'NotFound'
  }
}
