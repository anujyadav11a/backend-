import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";


const registerUser=asyncHandler(async (req,res)=>{
   //get data from frontend acc to usermodel
   //validation-not empty
   //check if user already exists:username,email
   //check for images and avtar
   //upload to cloudinary,avatar
   //create userobject-create a entry in db
   //remove password and refresh token from user object
   //check for user creation
   //return response


   //TAKING DATA
   const {fullname,email,username,password}=req.body
   // console.log("email",email);
 // VALIDATION
   if (
      [fullname,email,username,password].some((field)=>
      field?.trim()==="")
   ) {
      throw new ApiError(400,"all fields are required")
   }
    
   //CHECK USER ALL READY EXIT
    const existedUser=User.findOne({
      $or:[{ username} ,{email}]
   })

   if(existedUser){
      throw new ApiError(409,"User already exit")
   }
  

   // CHECK FOR AVATAR AND COVERIMAGE

  const avatarLocalPath= req.files?.avatar[0].path;
  const coverImageLocalPath= req.files?.coverimage[0].path;

  if(!avatarLocalPath){
   throw new ApiError(400,"avatar file is required")
   
  }
  const avatar=await uploadOnCloudinary(avatarLocalPath)
  const coverImage=await uploadOnCloudinary(coverImageLocalPath)
   if(!avatar){
      throw new ApiError(400,"avatar file is required")
   }

   // CRAETE USER ENTRY IN DB

  const user=await User.create({
      fullname,
      avatar:avatar.url,
      coverImage:coverImage?.url || "",
      email,
      password,
      username:username.toLowerCase()
   })

   const createduser=await User.findById(user._id).select(
      "-password -refreshToken"
   )
   if(!createduser){
      throw new ApiError(500,"user not created")

   }

   //SEND RESPONSE
      return res.status(200).json(
         new ApiResponse(200, createduser,"user is crested succesfully")
      )








})

export {registerUser}