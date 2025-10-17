import { ApiError } from "../utils/apiError.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import {User} from "../models/user.model.js"


export const verifyJWT= asyncHandler(async (req,res,next)=>{
    try {
        const Token=req.cookies?.accessToken || req.header
        ("authorization")?.replace("Bearer ","")
    
        if(!Token){
            
            throw new ApiError(401,"Unauthorized request")
        }
        //  console.log("token rececived:",Token)
        const DecodedToken=  jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET)
    
       const user = await User.findById(DecodedToken._id).select
        ("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401,"invalid Access Token")
    
        }
    
        req.user=user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid acess Token")
        
    }


})