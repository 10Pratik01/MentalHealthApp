import { Router } from "express" 
import { registeruser } from "../controller/user.controller.js"

const userRouter = Router()

userRouter.route('/register').post(registeruser)

export {userRouter}