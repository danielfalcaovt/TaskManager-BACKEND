/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-unreachable-loop */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/return-await */

import { NotFound } from '../../errors/param-not-found'
import { badRequest, ok } from '../../helper/http-helper'
import type { httpResponse, httpRequest } from '../../protocols/http'
import { MissingParamError, ServerError, query } from '../notes/note-protocols'
import { InvalidParamError } from '../../errors/invalid-param-error'

interface task {
  get: (httpRequest: httpRequest) => Promise<httpResponse>
  post: (httpRequest: httpRequest) => Promise<httpResponse>
  update: (httpRequest: httpRequest) => Promise<httpResponse>
  delete: (httpRequest: httpRequest) => Promise<httpResponse>
}

export class Task implements task {
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

    const userWeekDays = await query('SELECT * FROM tasks WHERE user_id = $1', [id])
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

  async post (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['id', 'taskName', 'taskText', 'taskDay']
    const allDays = ['monday', 'tuesday', 'thursday', 'wednesday', 'friday', 'saturday', 'sunday']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise((resolve) => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id, taskName, taskText, taskDay } = httpRequest.body
    const checkIfDayIsValid = allDays.find((day) => {
      return day === taskDay
    })
    if (!checkIfDayIsValid) {
      return new Promise((resolve) => {
        resolve(badRequest(new InvalidParamError('dia')))
      })
    }
    const checkIfUserExist = await query('SELECT * FROM users WHERE id = $1', [id])
    if (checkIfUserExist.rows.length <= 0) {
      return new Promise((resolve) => {
        resolve(badRequest(new NotFound('usuário')))
      })
    } else {
      const newTask = await query('INSERT INTO tasks(user_id, task_name, task_text, task_day) VALUES($1,$2,$3,$4) RETURNING *', [id, taskName, taskText, taskDay])
      if (newTask.rows.length > 0) {
        return new Promise((resolve) => {
          resolve(ok(newTask.rows))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(new ServerError())
        })
      }
    }
  }

  async update (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = [
      'id',
      'taskId'
    ]
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id, taskId } = httpRequest.body
    const { taskName, taskText, taskDay } = httpRequest.body
    let updateSetQuery = ''
    let queryCount = 0
    const paramsPassed: string[] = []
    if (taskName) {
      queryCount++
      updateSetQuery += `task_name = $${queryCount}`
      paramsPassed.push(taskName)
    }

    if (taskText) {
      if (queryCount > 0) {
        updateSetQuery += ','
      }
      queryCount++
      updateSetQuery += `task_text = $${queryCount}`
      paramsPassed.push(taskText)
    }

    if (taskDay) {
      if (queryCount > 0) {
        updateSetQuery += ','
      }
      const allDays = ['monday', 'tuesday', 'thursday', 'wednesday', 'friday', 'saturday', 'sunday']
      const checkIfDayIsValid = allDays.find((day) => {
        return day === taskDay
      })

      if (!checkIfDayIsValid) {
        return new Promise(resolve => {
          resolve(badRequest(new InvalidParamError('dia')))
        })
      }
      queryCount++
      updateSetQuery += `task_day = $${queryCount}`
      paramsPassed.push(taskDay)
    }

    if (!taskName && !taskText && !taskDay) {
      return new Promise((resolve) => {
        resolve(badRequest(new NotFound('Parâmetro')))
      })
    }
    const checkIfTaskExist = await query('SELECT * FROM tasks WHERE user_id = $1', [id])
    if (checkIfTaskExist.rows.length <= 0) {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    } else {
      const updatedTask = await query(`UPDATE tasks SET ${updateSetQuery} WHERE user_id = '${id}' AND id = '${taskId}' RETURNING *`, paramsPassed)
      if (updatedTask.rows.length > 0) {
        return new Promise(resolve => {
          resolve(ok(updatedTask.rows))
        })
      } else {
        return new Promise((resolve, reject) => {
          reject(new ServerError())
        })
      }
    }
  }

  async delete (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = [
      'id',
      'taskId'
    ]
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise(resolve => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id, taskId } = httpRequest.body
    const checkIfWeekExist = await query('SELECT * FROM week WHERE user_id = $1 AND task_id = $2', [id, taskId])
    if (checkIfWeekExist.rows.length <= 0) {
      return new Promise((resolve, reject) => {
        resolve(badRequest(new NotFound('task')))
      })
    }
    const deletedDay = await query('DELETE FROM tasks WHERE user_id = $1 AND task_id = $2 RETURNING *', [id, taskId])
    if (deletedDay.rows.length > 0) {
      return new Promise(resolve => {
        resolve(ok(deletedDay.rows))
      })
    } else {
      return new Promise((resolve, reject) => {
        reject(new ServerError())
      })
    }
  }
}
