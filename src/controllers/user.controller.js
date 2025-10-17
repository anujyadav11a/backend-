import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"


const genrateAcessAndRefreshToken=async(userId)=>{
  try {

   const user= await User.findById(userId)
   const refreshToken=user.generateRefreshToken()
   const accessToken=user.generateAccessToken()
   
   user.refreshToken=refreshToken
   await user.save({validateBeforeSave:false})

   return {refreshToken,accessToken}
   
  } catch (error) {
    console.log("error is :", error)
    throw new ApiError(500, "something went wrong while generating tokens")
  }
}


const registerUser = asyncHandler(async (req, res) => {
  

   //TAKING DATA
   const { fullname, email, username, password } = req.body

   // VALIDATION
   if (
      [fullname, email, username, password].some((field) =>
         field?.trim() === "")
   ) {
      throw new ApiError(400, "all fields are required")
   }

   //CHECK USER ALL READY EXIT
   const existedUser = await User.findOne({
      $or: [{ username }, { email }]
   })

   if (existedUser) {
      throw new ApiError(409, "User already exit")
   }


   // CHECK FOR AVATAR AND COVERIMAGE
   console.log("files:", req.files)
   const avatarLocalPath = req.files?.avatar[0].path;

   let coverImageLocalPath;
   if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
      coverImageLocalPath = req.files.coverImage[0].path;
   }

   if (!avatarLocalPath) {
      throw new ApiError(400, "avatar  is required")

   }
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   if (!avatar) {
      throw new ApiError(400, "avatar file is required")
   }

   // CRAETE USER ENTRY IN DB

   const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
   })

   const createduser = await User.findById(user._id).select(
      "-password -refreshToken"
   )
   if (!createduser) {
      throw new ApiError(500, "user not created")

   }

   //SEND RESPONSE
   return res.status(200).json(
      new ApiResponse(200, createduser, "user is crested succesfully")
   )

})

const userLogin= asyncHandler(async (req,res)=>{
   // req.body-> data
   //either username or email based login
   //find the user
   //password check
   //acess and refresh token
   //send cookies ( //acess and refresh token)
  

   const {email,username,password}=req.body

   if(!username && !email){
      throw new ApiError(400, "username or email is required")
   }

     const userexist= await User.findOne({
      $or: [{username}, {email}]
     })
     
     if(!userexist){
      throw new ApiError( 404, "user not found")

     }

   const  isPasswordvalid= await userexist.isPasswordCorrect(password)
   if(!isPasswordvalid){
      throw new ApiError(401 ,"password is incorrect")
   }
   

  const {refreshToken,accessToken}= await genrateAcessAndRefreshToken(userexist._id)

  const LoggedInUser=await User.findById(userexist._id).select("-password -refreshToken")

  const Option={
   httpOnly:true,
   secure:true

  }

  return res.status(200)
  .cookie("accessToken",accessToken , Option)
  .cookie("refreshToken",refreshToken , Option)

  .json(
    new ApiResponse(200,{
      user:LoggedInUser,accessToken,refreshToken
    },
     "user sucesfully login"
   )
  )

  
})

const userLogout= asyncHandler(async (req,res)=>{
     
  await User.findByIdAndUpdate(
      req.user._id,
      {
         $set:{
            refreshToken: undefined
         }
      },
      {
         new: true
      }
   )

   
  const Option={
   httpOnly:true,
   secure:true

  }

  return res.status(200)
  .clearCookie("accessToken")
  .clearCookie("refreshToken")
  .json(200 ,{}, "user logged out")
  

})

const refreshAccessToken= asyncHandler(async(req,res)=>{
  const incomingRefreshToken= req.cookie.refreshToken || req.body.refreshToken

  if(!incomingRefreshToken){
   throw new ApiError(401,"unauthorised request")
  }

 try {
   const DecodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
  
   const user=await User.findById(DecodedToken?._id)
  
   if(!user){
          throw new ApiError(401, "invalidRefreshToken")
   }
  
   if(incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401, "invalidRefreshToken")
   }
  
   const option={
     httpOnly:true,
     secure:true
   }
  
   const {newrefreshToken,accessToken}=await genrateAcessAndRefreshToken(user._id)
  
   res.status(200)
   .cookie("refreshToken",newrefreshToken,option)
   .cookie("accessToken",accessToken,option)
  
   
   .json(
     new ApiResponse(
        200,
        {
           accessToken,
           refreshtoken:newrefreshToken
        },
        "token is refresh"
  
     )
   )
 } catch (error) {
   throw new ApiError(500, "decoding of token is failed")
 }
})

export { registerUser, userLogin, userLogout ,refreshAccessToken }



