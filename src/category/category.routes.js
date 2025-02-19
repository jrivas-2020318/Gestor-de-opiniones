import { Router } from 'express'
import { getAll, get, save, update, deleteCategory } from "./category.controller.js"
import { isAdmin, isClient, validateJwt } from '../../middlewares/validate.jwt.js'

const api = Router()

api.get('/', [validateJwt], getAll)

api.get('/:id', [validateJwt, isAdmin], get)

api.post('/createCategory', [validateJwt, isAdmin], save)

api.put('/:id', [validateJwt, isAdmin], update)

api.delete('/:id', [validateJwt, isAdmin], deleteCategory)

export default api
