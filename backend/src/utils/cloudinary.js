import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


// function for uploading file from local server to cloudinary
const uplpadOnCloudinary = async function (localFilePath) {
    try {
        if (!localFilePath) {
            return null
        }
        //uploading file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file sucessfully uploaded on cloudinary
        console.log("file sucessfully uploaded on cloudinary " + response.url);
        fs.unlinkSync(localFilePath);
        return response
    } catch (error) {
        console.log(`Uploading Error ${error}`);
        fs.unlink(localFilePath);//removing file from localy saved temprorary file as the file upload operation got failed
        return null
    }
}

export { uplpadOnCloudinary }   