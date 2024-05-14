/* eslint-disable no-unreachable-loop */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/return-await */

import { NotFound } from '../../errors/param-not-found'
import { badRequest, ok } from '../../helper/http-helper'
import type { httpResponse, httpRequest } from '../../protocols/http'
import { MissingParamError, ServerError, query } from '../notes/note-protocols'

interface week {
  get: (httpRequest: httpRequest) => Promise<httpResponse>
  post: (id: string) => Promise<httpResponse>
  update: (httpRequest: httpRequest) => Promise<httpResponse>
  // delete: (httpRequest: httpRequest) => Promise<httpResponse>
}

export class Week implements week {
  async get (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = [
      'id'
    ]
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id } = httpRequest.body

    const userWeekDays = await query('SELECT * FROM week WHERE user_id = $1', [id])
    if (userWeekDays.rows.length > 0) {
      return new Promise(resolve => {
        resolve(ok(userWeekDays.rows))
      })
    } else {
      return new Promise(resolve => [
        resolve(badRequest(new NotFound('week')))
      ])
    }
  }

  async post (id: string): Promise<httpResponse> {
    if (!id) {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
    const checkIfUserAlreadyHasWeek = await query('SELECT * FROM week WHERE user_id = $1', [id])
    if (checkIfUserAlreadyHasWeek.rows.length > 0) {
      return new Promise(resolve => {
        resolve(badRequest(new Error('Semana já existente.')))
      })
    }

    const queryResult = await query('INSERT INTO week(user_id) VALUES ($1) RETURNING *', [id])
    if (queryResult.rows.length > 0) {
      return new Promise(resolve => {
        resolve(ok(queryResult.rows))
      })
    } else {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
  }

  async update (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = [
      'id'
    ]
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id } = httpRequest.body
    const checkIfWeekExist = await query('SELECT * FROM week WHERE user_id = $1', [id])
    if (checkIfWeekExist.rows.length <= 0) {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
    const allWeekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const parameterWasProvided = allWeekDays.find((day) => {
      let foundDay
      for (const dayInBody in httpRequest.body) {
        foundDay = day === dayInBody
      }
      return foundDay
    })
    if (!parameterWasProvided) {
      return new Promise(resolve => {
        resolve(badRequest(new NotFound('parameter')))
      })
    }
    const paramValue = httpRequest.body[parameterWasProvided]
    const updatedWeek = await query(`UPDATE week SET ${parameterWasProvided} = $1 WHERE user_id = $2 RETURNING *`, [paramValue, id])
    if (updatedWeek.rows.length <= 0) {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
    return new Promise(resolve => {
      resolve(ok(updatedWeek.rows))
    })
  }

  async delete (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = [
      'id',
      'dayOfWeek'
    ]
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id, dayOfWeek } = httpRequest.body
    const checkIfWeekExist = await query('SELECT * FROM week WHERE user_id = $1', [id])
    if (checkIfWeekExist.rows[0][dayOfWeek] === null) {
      return new Promise((resolve, reject) => {
        resolve(badRequest(new NotFound('task')))
      })
    }
    const allWeekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    const dayWasProvided = allWeekDays.find((day) => {
      return day === dayOfWeek
    })
    if (!dayWasProvided) {
      return new Promise(resolve => {
        resolve(badRequest(new MissingParamError('day')))
      })
    }
    const deletedDay = await query(`UPDATE week SET ${dayWasProvided} = null WHERE user_id = $1 RETURNING *`, [id])
    if (deletedDay.rows.length <= 0) {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
    return new Promise(resolve => {
      resolve(ok(deletedDay.rows))
    })
  }
}
