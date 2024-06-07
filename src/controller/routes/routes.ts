/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { loginRoute } from '../../model/auth/login/login-route'
import { verifyUser } from '../../model/helper/auth-filter'
import { registerRoute } from '../../model/auth/register/register-route'
import getNotes from '../../model/data/notes/routes/notes-get'
import postNotes from '../../model/data/notes/routes/notes-post'
import { deleteNotes } from '../../model/data/notes/routes/notes-delete'
import patchNotes from '../../model/data/notes/routes/notes-patch'
import { getTasks } from '../../model/data/tasks/routes/task-get'
import { updateWeek } from '../../model/data/tasks/routes/task-update'
import { deleteWeek } from '../../model/data/tasks/routes/task-delete'
import postTask from '../../model/data/tasks/routes/task-post'
import ForgotPasswordRoute from '../../model/auth/forgot-password/forgotPasswordRoute'
import ConfirmPasswordRoute from '../../model/auth/forgot-password/confirmPasswordRoute'
import { getFilteredTask } from '../../model/data/tasks/routes/task-filter-get'
import getUser from '../../model/data/users/routes/getUser'

const routes = Router()

routes.post('/register', registerRoute)
routes.post('/login', loginRoute)
routes.post('/forget', ForgotPasswordRoute)
routes.post('/confirm', ConfirmPasswordRoute)

routes.use(verifyUser)

routes.get('/user', getUser)

routes.get('/notes', getNotes)
routes.post('/notes', postNotes)
routes.delete('/notes', deleteNotes)
routes.patch('/notes', patchNotes)

routes.get('/tasks', getTasks)
routes.post('/tasks', postTask)
routes.post('/tasks/filter', getFilteredTask)
routes.patch('/tasks', updateWeek)
routes.delete('/tasks', deleteWeek)

export default routes
