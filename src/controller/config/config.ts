import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit'

export class Config {
  rateLimiter (): RateLimitRequestHandler {
    return rateLimit({
      windowMs: 2 * 60 * 1000,
      max: 50,
      message: 'Você excedeu o limite de requisições, por favor tente novamente mais tarde.'
    })
  }
}
