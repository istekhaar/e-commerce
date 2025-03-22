import { User } from "../models/user";
import jwt from "jsonwebtoken";
import {asyncHendler} from "../utils/asyncHeandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";

const generateAcessAndRefreshToken = async(userId)=>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "somethig went worng while genrating reserdh and access token")
    }
}

const userRegister=asyncHendler(async(req, res)=>{
    const {username, email, fullName, password} = req.body;
    console.log("data=> ",username);

    if(!(username, email, fullName, password)){
        throw new ApiError(400, "all fields are required")
    }
    
    const user = await User.findOne({
        $or:[{username}, {email}]
    })
    if(user){
        throw new ApiError(400, "user already exists")
    }


    const createUser= await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password
    }).select("-password -refreshToken")
    console.log("user=> ",createUser);
    
    if(!createUser){
        throw new ApiError(500, "somethig wnet worng while, creattion user")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, createUser, "user register successfully"))
})

export{
    userRegister,
}