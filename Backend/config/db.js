import mongoose from "mongoose";

const connectdb = async ()=>{
    try{        
        await mongoose.connect(process.env.Mongo_URI);
        console.log("databse connected");
    }catch(error){
        console.log(error)
        
    }
}

export default connectdb;