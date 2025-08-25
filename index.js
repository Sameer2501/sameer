import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/dbConfig.js";
import authRoutes from "./routes/authRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());

 dbConnection();
 app.use("/api/auth", authRoutes);
app.listen(process.env.PORT,()=>{
    console.log(`server is running on Port ${process.env.PORT}` )
})



