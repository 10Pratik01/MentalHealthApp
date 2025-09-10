import { Router } from "express" 
import { protect } from "../middleware/auth.js"
import { changePassword, getUserProfile, loginuser, logoutuser, registeruser, updateUserProfile } from "../controller/user.controller.js"

const userRouter = Router()

userRouter.route('/register').post(registeruser)
userRouter.route('/login').post(loginuser)
userRouter.route('/logout').post(logoutuser)
userRouter.route('/updateprofile').put(protect ,updateUserProfile)
userRouter.route('/getUser').get(protect, getUserProfile)
userRouter.route('/changepassword').post(protect, changePassword)


export {userRouter}