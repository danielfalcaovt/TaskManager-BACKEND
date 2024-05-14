/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { loginRoute } from '../../model/auth/login/login-route'
import { verifyUser } from '../../model/helper/auth-filter'
import { registerRoute } from '../../model/auth/register/register-route'
import getNotes from '../../model/data/notes/routes/notes-get'
import postNotes from '../../model/data/notes/routes/notes-post'
import { deleteNotes } from '../../model/data/notes/routes/notes-delete'
import patchNotes from '../../model/data/notes/routes/notes-patch'
import { getWeek } from '../../model/data/week/routes/week-get'
import { updateWeek } from '../../model/data/week/routes/week-update'

const routes = Router()

routes.post('/register', registerRoute)
routes.post('/login', loginRoute)

routes.use(verifyUser)

routes.get('/notes', getNotes)
routes.post('/notes', postNotes)
routes.delete('/notes', deleteNotes)
routes.patch('/notes', patchNotes)

routes.get('/week', getWeek)
routes.patch('/week', updateWeek)

export default routes
