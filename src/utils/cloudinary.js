import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key:process.env.CLOUDINARY_CLOUD_KEY , 
        api_secret:process.env.CLOUDINARY_CLOUD_SECRET  // Click 'View API Keys' above to copy your API secret
    });

    const uploadOnCloudinary=async (localFilePath)=>{
        try {
            if(!localFilePath)return null
            //upload file at cloudnary
           const response=await cloudinary.uploader.upload(localFilePath,{
                resource_type:"auto"
            })
            console.log("file is uploaded",response.url);
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath)// remove the loclly saved file as the upload operation get failed
            return null;
        }
    }

    export {uploadOnCloudinary}