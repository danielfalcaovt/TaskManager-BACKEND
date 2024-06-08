/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-unreachable-loop */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/return-await */

import { NotFound } from '../../errors/param-not-found'
import { badRequest, ok, serverError } from '../../helper/http-helper'
import type { httpResponse, httpRequest } from '../../protocols/http'
import { MissingParamError, ServerError, query } from '../notes/note-protocols'
import { InvalidParamError } from '../../errors/invalid-param-error'

interface task {
  get: (httpRequest: httpRequest) => Promise<httpResponse>
  getOne: (httpRequest: httpRequest) => Promise<httpResponse>
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
        resolve(badRequest(new NotFound('Tarefa')))
      ])
    }
  }

  async getOne (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['id', 'taskDay', 'taskMonth']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise((resolve) => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id, taskDay, taskMonth } = httpRequest.body
    if (Number(taskMonth) < 0 || Number(taskMonth) > 11) {
      return new Promise(resolve => {
        resolve(serverError())
      })
    }

    if (taskDay >= 1 && taskDay <= 31) {
      const foundTask = await query('SELECT * FROM tasks WHERE user_id = $1 AND task_day = $2 AND task_month = $3', [id, taskDay, taskMonth])
      if (foundTask.rows.length >= 1) {
        return new Promise((resolve) => {
          resolve(ok(foundTask.rows))
        })
      } else {
        return new Promise((resolve) => {
          resolve(ok({ error: 'Tarefa não encontrada', task_day: taskDay, task_month: taskMonth }))
        })
      }
    } else {
      return new Promise((resolve) => {
        resolve(badRequest(new InvalidParamError('dia')))
      })
    }
  }

  async post (httpRequest: httpRequest): Promise<httpResponse> {
    const requiredParameters = ['id', 'taskName', 'taskText', 'taskDay', 'taskMonth']
    for (const pos of requiredParameters) {
      if (!httpRequest.body[pos]) {
        return new Promise((resolve) => {
          resolve(badRequest(new MissingParamError(pos)))
        })
      }
    }
    const { id, taskName, taskText, taskDay, taskMonth } = httpRequest.body
    if (Number(taskMonth) <= 0 || Number(taskMonth) > 12) {
      return new Promise(resolve => {
        // RETORNA SERVER ERROR CASO O FRONTEND ENVIE UM MES INVALIDO
        resolve(serverError())
      })
    }
    if (Number(taskDay) >= 1 && Number(taskDay) <= 31) {
      const checkIfUserExist = await query('SELECT * FROM users WHERE id = $1', [id])
      if (checkIfUserExist.rows.length <= 0) {
        return new Promise((resolve) => {
          resolve(badRequest(new NotFound('Usuário')))
        })
      } else {
        const newTask = await query('INSERT INTO tasks(user_id, task_name, task_text, task_day, task_month) VALUES($1,$2,$3,$4,$5) RETURNING *', [id, taskName, taskText, taskDay, taskMonth])
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
    } else {
      return new Promise((resolve) => {
        resolve(badRequest(new InvalidParamError('dia')))
      })
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
