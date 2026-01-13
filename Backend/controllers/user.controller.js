import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import getDataUri from "../config/datauri.js";
import cloudinary from "../config/cloudinary.js";

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

//-----------------------------------------------------------------------------------------------------------------------

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        

        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing .",
                success: false
            })
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({
                message: "Email or password is incorrect.",
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Email or password is incorrect.",
                success: false
            })
        }



        const frontendUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            follower: user.follower,
            following: user.following,
            post: user.post

        }

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.cookie('token', token, {
            httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000
        }).json({
            message: `welcome back ${user.username}`,
            success: true,
            frontendUser
        })



    } catch (error) {
        console.log(error)
    }
}

//-----------------------------------------------------------------------------------------------------------------------


export const logout = async (_, res) => {
    try {
        return res.cookie('token', "", { maxAge: 0 }).json({
            message: "Logged out succesfully",
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//-----------------------------------------------------------------------------------------------------------------------


export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-password');
        return res.status(200).json({
            user,
            success: true
        })
    } catch (error) {
        console.log(error)
    }
}

//-----------------------------------------------------------------------------------------------------------------------

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;

        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);;
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            })
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated',
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
}

//-----------------------------------------------------------------------------------------------------------------------

export const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.id;              // got from middleware
        const suggestedUsers = User.find({ _id: { $ne: userId } }).select("-passqord");       //select function will select everything fron user and -password means everything except password
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any user'
            })
        }

        return res.status(200).json({

            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error)
    }
}

//-----------------------------------------------------------------------------------------------------------------------

export const followOrUnfollow = async (req, res) => {
    try {
        const followKarneWala = req.id;
        const jiskoFollowKiya = req.params.id;

        if (followKarneWala === jiskoFollowKiya) {
            return res.status(400).json({
                message: "You cannot follow yourself",
                success: false
            })
        }

        const user = await User.findById(followKarneWala);
        const targetUser = await User.findById(jiskoFollowKiya);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }

        //Now checking if we want to follow or unfollow

        const isFollowing = user.following.includes(jiskoFollowKiya);
        if (isFollowing) {
            //unfollow logic
            //Promise is used because we have to update both user jisnefollowkiya and jisko kiya at the same time
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $pull: { following: jiskoFollowKiya } }),
                User.updateOne({ _id: jiskoFollowKiya }, { $pull: { follower: followKarneWala } })
            ])
            return res.status(200).json({
                message: "Unfollow succesfully",
                success: true
            })
        }
        else {
            //follow logic
            //Promise is used because we have to update both user jisnefollowkiya and jisko kiya at the same time
            await Promise.all([
                User.updateOne({ _id: followKarneWala }, { $push: { following: jiskoFollowKiya } }),
                User.updateOne({ _id: jiskoFollowKiya }, { $push: { follower: followKarneWala } })
            ])
            return res.status(200).json({
                message: "Follow succesfully",
                success: true
            })
        }

    } catch (error) {
        console.log(error);
    }
}

