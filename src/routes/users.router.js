import express from 'express'
import { userController } from '../controllers/user.controller.js'

const userRoutes = express.Router()

userRoutes.use('/getAllUser', userController.getAllUser)

export default userRoutes