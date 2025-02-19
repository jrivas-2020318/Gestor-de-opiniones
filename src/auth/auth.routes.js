import {Router} from 'express'
import{
    login,
    register
} from './auth.controller.js'
import { loginValidator } from '../../helpers/validators.js'

const api = Router()

api.post('/register', register)
api.post('/login', [loginValidator], login)

export default api
