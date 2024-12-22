import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken.js"

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing .",
                success: false
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try with diffrent email.",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashedPassword
        })

        return res.status(201).json({
            message: "User created succesfully . ",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}



export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;

    if (!email || !password) {
        return res.status(401).json({
            message: "Something is missing .",
            success: false
        })
    }

    const user = User.findOne({email});
    if(!user)
    {
        return res.status(401).json({
            message: "Email or password is incorrect.",
            success: false
        })
    }

    const isMatch = await bcrypt.compare(password,User.password);

    if(!isMatch)
    {
        return res.status(401).json({
            message: "Email or password is incorrect.",
            success: false
        })
    }



    const frontendUser = {
        _id:User._id,
        username:User.username,
        email:User.email,
        profilePicture:User.profilePicture,
        bio:User.bio,
        gender:User.gender,
        follower:User.follower,
        following:User.following,
        post:User.post

    }

    const token = await jwt.sign({userId:User._id},process.env.SECRET_KEY,{expiresIn:'1d'});
    return res.cookie('token',token,{
        httpOnly:true, sameSite : 'strict', maxAge : 1*24*60*60*1000
    }).json({
        message : `welcome back ${User.username}`,
        success:true,
        frontendUser
    })



    } catch (error) {
        console.log(error)
    }
}

export const logout = async(_,res)=>{
    try {
        return res.cookie('token',"",{maxAge:0}).json({
            message: "Logged out succesfully",
            success : true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getProfile = async (req,res)=>{
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        return res.status(200).json({
            user,
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}