import express from 'express'
import type { Application } from 'express'

import { authRouter } from './auth/routes.js'
import todoRouter from './todo/routes.js'
import weatherRouter from './weather/routes.js'
import { authenticationMiddleware} from './middleware/auth-middleware.js'


export function createServerApplication():Application {
    const app = express()

    app.use(express.json())
    app.use(authenticationMiddleware())
    
    app.use('/todos', todoRouter)
    app.use('/weather', weatherRouter)
    app.use ('/auth', authRouter)
    
    return app
}