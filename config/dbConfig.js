import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const dbConnection=async()=>{
    try{
        await mongoose.connect(process.env.MONGOURL)
        console.log("MongoDB Connected successfully")
    }
    catch(err){
        console.log(err.message)
    }
}
export default dbConnection;