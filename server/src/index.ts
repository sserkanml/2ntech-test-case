import "dotenv/config"
import express from "express"
import cors from "cors"
import morgan from "morgan"
import connectDatabase from "@/configs/mongo"
import * as authRouter from "@routes/auth"
import * as todoRouter from "@routes/todo"
import { authenticate } from "@/middlewares/auth" 


const PORT = process.env.PORT || 3000

connectDatabase()
const app = express()

app.use(morgan("dev"))
app.use(express.json({
    limit: "10mb"
}))
app.use(cors({
    origin: "*",
    credentials: true
}))
app.use('/api/auth', authRouter.default)
app.use('/api/todos', authenticate, todoRouter.default)
app.use(express.json({
    limit: "10mb"
}))

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})