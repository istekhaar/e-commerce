import {asyncHendler} from "../utils/asyncHendler.js";
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.models.js"

export const verifyJWT = asyncHendler(async(req, res, next)=>{
    try {
        const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Beare", "")

        if(!token){
            throw new ApiError(401, "Unauthorized requiest")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRECT)
 
        const user = await User.findById(decodedToken?._id).select("-refreshToken, -password")
    
        if(!user){
            throw new ApiError(401, "invalid access token")
        }
    
        req.user = user;
        next()
    } catch (error) {
    throw new ApiError(401, error?.message || "invalid access token")
    }
})
