import { User } from "../models/user.js";
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

const loginUser=asyncHendler(async(req, res)=>{
    const {email, password}=req.body

    if(!(email && password)){
        throw new ApiError(400, "eamil and password are required")
    }

    const user=await User.findOne(email)
    
    if(!user){
        throw new ApiError(404, "user not found")
    }
    
    const isPasswordCurret=await user.isPasswordCurrect(password)
    if(!isPasswordCurret){
        throw new ApiError(404, "password wrong")
    }
    
    const {accessToken, refreshToken} = generateAcessAndRefreshToken(user?.id)

    const logedinUser=await User.findOne(user.id).select("-password -refreshToken")

    const options={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(200, {user:logedinUser, accessToken, refreshToken}, "login successfully")
})

const logoutUser=asyncHendler(async(req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken: 1
            }
        },
        {new: true}
    )

    const options={
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "logout successfully"))
})
export{
    userRegister,
    loginUser,
    logoutUser,
}