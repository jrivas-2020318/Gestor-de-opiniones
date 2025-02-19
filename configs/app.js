'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet' // Seguridad para HTTP
import cors from 'cors'

import { limiter } from '../middlewares/rate.limit.js'
import authRoutes from '../src/auth/auth.routes.js'
import userRoutes from '../src/user/user.routes.js'
import productRoutes from '../src/product/product.routes.js'
import categoryRoutes from '../src/categorie/category.routes.js'

const configs = (app) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())
    app.use(helmet())
    app.use(limiter)
    app.use(morgan('dev'))
}

const routes = (app) => {
    app.use('/',authRoutes)
    app.use('/v1/user',userRoutes)
    app.use('/v1/product',productRoutes)
    app.use('/v1/category',categoryRoutes)
}

export const initServer = async () => {
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT)
        console.log(`🚀 Server running on port ${process.env.PORT}`)
    } catch (error) {
        console.error('❌ Error on server initialization', error)
    }
}
