import express from 'express'
import { saveImagesController } from '../controllers/saveImage.controller.js'

const saveImageRouter = express.Router()

saveImageRouter.use('/getAllSaveImages', saveImagesController.getAllSaveImagesInfo)

export default saveImageRouter