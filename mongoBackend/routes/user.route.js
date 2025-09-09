import { Router } from "express" 
import { loginuser, logoutuser, registeruser, updateUserProfile } from "../controller/user.controller.js"
import { protect } from "../middleware/auth.js"

const userRouter = Router()

userRouter.route('/register').post(registeruser)
userRouter.route('/login').post(loginuser)
userRouter.route('/logout').post(logoutuser)
userRouter.route('/updateprofile').post(protect ,updateUserProfile)

export {userRouter}