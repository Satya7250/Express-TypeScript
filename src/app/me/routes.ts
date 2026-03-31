
import express from 'express'
import type { Router } from 'express'

import UserController from './controller.js'

const usercontroller = new UserController()

export const userRouter: Router = express.Router()

//routes
userRouter.get('/me',usercontroller.handleMe.bind(usercontroller))
