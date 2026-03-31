import express from 'express'
import type { Application } from 'express'

import { authRouter } from './auth/routes.js'
import todoRouter from './todo/routes.js'
import weatherRouter from './weather/routes.js'
import {userRouter} from './me/routes.js'
import { authenticationMiddleware, restrictToAuthenticatedUser} from './middleware/auth-middleware.js'


export function createServerApplication():Application {
    const app = express()

    app.use(express.json())
    app.use(authenticationMiddleware())
    
    app.use('/todos', restrictToAuthenticatedUser(),todoRouter)
    app.use('/weather', restrictToAuthenticatedUser(), weatherRouter)
    app.use ('/auth', authRouter)
    app.use('/users', restrictToAuthenticatedUser(),userRouter)
    
    return app
}