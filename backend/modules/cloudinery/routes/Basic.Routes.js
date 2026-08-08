import express from 'express'
import upload from '../Multer.middleware.js';
import { UploadImage } from '../controller/UploadImage.Controller.js';
import { RemoveImage } from '../controller/RemoveImage.Controller.js';

const imageRoutes = express.Router()

imageRoutes.post('/upload/:type',upload.single('image'),UploadImage)
imageRoutes.delete('/remove',RemoveImage)



// http://localhost:5000/api/v1/images/upload/:type


export default imageRoutes;