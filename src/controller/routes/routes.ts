/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { deleteNotes, ConfirmPasswordRoute, ForgotPasswordRoute, getNotes, getUser, patchNotes, postNotes, postTask, deleteWeek, getFilteredTask, getNotification, getTasks, loginRoute, registerRoute, updateWeek, verifyUser } from './routes-protocols'

const routes = Router()

routes.post('/register', registerRoute)
routes.post('/login', loginRoute)
routes.post('/forget', ForgotPasswordRoute)
routes.post('/confirm', ConfirmPasswordRoute)

routes.use(verifyUser)

routes.get('/user', getUser)

routes.get('/notes', getNotes)
routes.post('/notes', postNotes)
routes.delete('/notes/:noteId/:userId', deleteNotes)
routes.patch('/notes', patchNotes)

routes.get('/tasks', getTasks)
routes.post('/tasks', postTask)
routes.post('/tasks/filter', getFilteredTask)
routes.patch('/tasks', updateWeek)
routes.delete('/tasks', deleteWeek)

routes.get('/notification', getNotification)

export default routes
