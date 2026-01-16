import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({});

import connectdb from './config/db.js'
import userRoute from './routes/user.route.js'
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";

const app = express()


//Some important MiddleWares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


// const corsOption ={
//     origin : 'http://localhost:5173',
//     credential : true
// }
// app.use(cors(corsOption));
app.use(cors({
  origin: "http://localhost:5173", // Vite default
  credentials: true
}))

app.get('/',(req,res)=>{
    res.send("Hello World ..");
})

app.use("/api/v1/user",userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    connectdb();
    console.log(`Server running at ${PORT}`)
})