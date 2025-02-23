import { Router } from 'express'
import { getAll, get, save, update, deleteCategory } from "./category.controller.js"
import { isAdmin, isClient, validateJwt } from '../../middlewares/validate.jwt.js'
import { createCategoryValidator, updateCategoryValidator } from '../../helpers/validators.js'

const api = Router()

api.get('/', [validateJwt], getAll)

api.get('/:id', [validateJwt], get)

api.post('/createCategory', [validateJwt, isAdmin, createCategoryValidator], save)

api.put('/:id', [validateJwt, isAdmin, updateCategoryValidator], update)

api.delete('/:id', [validateJwt, isAdmin], deleteCategory)

export default api
