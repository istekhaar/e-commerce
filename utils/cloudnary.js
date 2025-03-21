import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


const uplodeOnCloudinary = async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        //uplode on cloudindy

        const reponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        //file uploded successfully
        // console.log("file is uplodede on cloudnary ", reponse.url);
        fs.unlinkSync(localFilePath)
        // console.log("response for sytdy => ",reponse);
        // reponse.unlinkSync(localFilePath)
        return reponse;
        
    } catch (error) {
        fs.unlinkSync(localFilePath)//remove localy saved file as the uplode opration got faild

        return null;
    }
}

export { uplodeOnCloudinary }
