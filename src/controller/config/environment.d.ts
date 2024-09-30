declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PG_HOST: string
      PG_USER: string
      PG_DB: string
      PG_PORT: string
      PG_PASSWORD: string
      JWT_TOKEN: string
      SENDGRID_APIKEY: string
    }
  }
}

export {}
