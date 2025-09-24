import express from "express"
import dotenv from "dotenv"
dotenv.config()
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import superadminRouter from "./routes/superadmin.routes.js"
import itemRouter from "./routes/item.routes.js"
import shopRouter from "./routes/shop.routes.js"
import orderRouter from "./routes/order.routes.js"
import categoryRouter from "./routes/category.routes.js"
import http from "http"
import { Server } from "socket.io"
import { socketHandler } from "./socket.js"
import cron from "node-cron"
import { autoRegenerateOtps } from "./controllers/order.controllers.js"

const app=express()
const server=http.createServer(app)

const io=new Server(server,{
   cors:{
    origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://foodway-16ko.vercel.app",
        "http://localhost:5173"
    ],
    credentials:true,
    methods:['POST','GET', 'PUT', 'DELETE', 'OPTIONS']
},
transports: ['websocket', 'polling'],
allowEIO3: true,
pingTimeout: 60000,
pingInterval: 25000,
upgradeTimeout: 30000,
maxHttpBufferSize: 1e6
})

app.set("io",io)

// Middleware to attach socket.io to request object
app.use((req, res, next) => {
    req.io = io
    next()
})

const port=process.env.PORT || 5000
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || "http://localhost:5173",
        "https://foodway-16ko.vercel.app",
        "http://localhost:5173"
    ],
    credentials:true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/superadmin",superadminRouter)
app.use("/api/shop",shopRouter)
app.use("/api/item",itemRouter)
app.use("/api/order",orderRouter)
app.use("/api/categories",categoryRouter)

socketHandler(io)

// Schedule OTP regeneration every 2 hours
cron.schedule('0 */2 * * *', () => {
    console.log('Running automatic OTP regeneration...')
    autoRegenerateOtps()
})

server.listen(port,()=>{
    connectDb()
    console.log(`server started at ${port}`)
})

