import { Router } from 'express'
import { getAll, get, update, deleteUser, updatePassword} from "./user.controller.js"
import { validateJwt, isAdmin, isClient  } from '../../middlewares/validate.jwt.js'// Validación de roles
import {updateUservalidator } from '../../helpers/validators.js'

const api = Router()

api.get('/', [validateJwt, isAdmin], getAll)
api.get('/profile', [validateJwt,], get)
api.put('/:id', [validateJwt, updateUservalidator], update)
api.put('/updatepassword/password',[validateJwt], updatePassword)
api.delete('/:id', [validateJwt, isAdmin], deleteUser)

export default api
