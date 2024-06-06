/* eslint-disable @typescript-eslint/unbound-method */
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import routes from './routes/routes'
import { Config } from './config/config'

const app = express()
const port: number = 3000
const config = new Config()
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(config.rateLimiter())
app.use(routes)

app.listen(port, () => {
  console.log(`App is running in ${port} port.`)
})
