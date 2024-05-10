/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { loginRoute } from '../../model/auth/login/login-route'
import { verifyUser } from '../../model/helper/auth-filter'
import { register } from '../../model/auth/register/register'
import getNotes from '../../model/data/notes/routes/notes-get'
import postNotes from '../../model/data/notes/routes/notes-post'
import { deleteNotes } from '../../model/data/notes/routes/notes-delete'
import patchNotes from '../../model/data/notes/routes/notes-patch'

const routes = Router()

routes.post('/register', register)
routes.post('/login', loginRoute)

routes.use(verifyUser)

routes.get('/notes', getNotes)
routes.post('/notes', postNotes)
routes.delete('/notes', deleteNotes)
routes.patch('/notes', patchNotes)

export default routes
