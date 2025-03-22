import { Router } from "express";
import {userRegister, loginUser, logoutUser} from "../controllers/user.js"
import {verifyJWT} from "../middewares/auth.middeware.js"

const router=Router()

router.route("/register").post(userRegister)
router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(verifyJWT, logoutUser)

export default router