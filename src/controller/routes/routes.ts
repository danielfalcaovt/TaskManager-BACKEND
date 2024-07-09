/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { deleteNotes, ConfirmPasswordRoute, ForgotPasswordRoute, getNotes, getUser, patchNotes, postNotes, postTask, deleteTask, getFilteredTask, getNotification, getTasks, loginRoute, registerRoute, updateWeek, verifyUser } from './routes-protocols'
import { deleteAllTasks } from '../../model/data/tasks/routes/task-delete-all'
import { deleteAllNotes } from '../../model/data/notes/routes/notes-delete-all'

const routes = Router()

routes.post('/register', registerRoute)
routes.post('/login', loginRoute)
routes.post('/forget', ForgotPasswordRoute)
routes.post('/confirm', ConfirmPasswordRoute)

routes.use(verifyUser)

routes.get('/user', getUser)

routes.get('/notes', getNotes)
routes.post('/notes', postNotes)
routes.patch('/notes', patchNotes)
routes.delete('/notes/:noteId/:userId', deleteNotes)
routes.delete('/notes/:userId/:sure/all', deleteAllNotes)

routes.get('/tasks', getTasks)
routes.post('/tasks', postTask)
routes.post('/tasks/filter', getFilteredTask)
routes.patch('/tasks', updateWeek)
routes.delete('/tasks/:userId/:taskId', deleteTask)
routes.delete('/tasks/:userId/:sure/all', deleteAllTasks)

routes.get('/notification', getNotification)

export default routes
