import mongoose from "mongoose"


const connectDatabase  = async (): Promise<void>  => {
    try {

        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test")
        console.log("mongodb connection is created")
    } catch (error) {
        console.log("error is occuried",error)
        process.exit(1)
    }
}

export default connectDatabase;