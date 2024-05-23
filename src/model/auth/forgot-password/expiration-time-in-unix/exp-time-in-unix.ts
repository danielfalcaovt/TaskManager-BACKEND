interface generateTimeInUnix {
  generate: () => string
}

export class GenerateTimeInUnix implements generateTimeInUnix {
  generate (): string {
    const actuallyDay = new Date()
    const expirationTime = new Date()
    expirationTime.setHours(actuallyDay.getHours() + 8)
    const timeInUnix = expirationTime.getTime()
    return String(timeInUnix)
  }
}
