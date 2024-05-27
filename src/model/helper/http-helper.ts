import { ServerError } from '../errors/server-error'
import type { httpResponse } from '../protocols/http'

export const badRequest = (error: Error): httpResponse => {
  return {
    statusCode: 400,
    body: error.message
  }
}

export const ok = (body: any): httpResponse => {
  return {
    statusCode: 200,
    body
  }
}

export const authError = (error: Error): httpResponse => {
  return {
    statusCode: 300,
    body: error.message
  }
}

export const serverError = (): httpResponse => {
  return {
    statusCode: 500,
    body: new ServerError()
  }
}
