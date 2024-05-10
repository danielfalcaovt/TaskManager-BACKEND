/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import pg from 'pg'
import * as dotenv from 'dotenv'
dotenv.config()

const db = new pg.Pool({
  host: process.env.PG_HOST,
  user: process.env.PG_USER,
  database: process.env.PG_DB,
  port: Number(process.env.PG_PORT),
  password: process.env.PG_PASSWORD
})

db.connect()

async function query (sql: string, values?: string[]): Promise<pg.QueryResult<any>> {
  if (values) {
    return await db.query(sql, values)
  } else {
    return await db.query(sql)
  }
}

export { db, query }
