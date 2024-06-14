/*cloudinary is imported from the cloudinary package, and the v2 API is used.
fs is the Node.js file system module used to interact with the file system.
The cloudinary.config method configures Cloudinary with credentials (cloud name, API key, and API secret) 
obtained from environment variables.*/
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null;
        //Upload the file on cloudinary
       const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        //console.log("file is uploaded on cloudinary successfully", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // Remove the locally saved temporary file as the upload operation got failed!!!
        return null;
        
        
    }
}
export default uploadOnCloudinary;


