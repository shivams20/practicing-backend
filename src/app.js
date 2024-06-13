import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
// Data can come in any form like json, url, form etc...
// To convert data into json (the data which is coming)
app.use(express.json({limit: "16kb"}))
// When daat comes into form of URL. extended means you can give objects inside objects(nested objects)
app.use(express.urlencoded({extended: true, limit: "16kb"}))
//When we want to store some files, folders, pdf, images, so we make public folder that public assets are there so anybody can access it...
app.use(express.static("public"))
app.use(cookieParser())

//Routes import
import userRoute from './routes/user.routes.js'

//Routes Declaration
app.use("/api/v1/users", userRoute)
//http://localgost:8000/api/v1/users/register
export default app;