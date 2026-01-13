import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, register } from "../controllers/user.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route('/register').post(register);    //This is similar to {"router.post('/register',register);"} and this register is defined in user.controller
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/profile/edit').post(isAuthenticated, upload.single('profilePicture'),editProfile );
router.route('/suggested').get(isAuthenticated, getSuggestedUsers);
router.route('/followorunfollow/:id').get(isAuthenticated, followOrUnfollow);

export default router;


