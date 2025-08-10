import express from "express"
import cors from "cors"
import { connectDB } from "./Config/db.js"
import foodRouter from "./Routes/foodRoute.js"
import userRouter from "./Routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./Routes/cartRoute.js"
import orderRouter from "./Routes/orderRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000

// middleware
app.use(express.json())
app.use(cors())

// db connection
connectDB();

// api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('Uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)

app.get("/",(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost: ${port}`)
})