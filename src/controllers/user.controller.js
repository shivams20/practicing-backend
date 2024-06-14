import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import uploadOnCloudinary from '../utils/cloudinary.js';
import ApiResponse from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async(req, res) => {
   // get details from user
   // validation - not empty
   // check if user already exist: username, email
   // check for images, check for avatar
   // upload them to cloudinary, avatar
   // create user object - create entry in db
   // remove password and refresh token field from repsonse
   // check for user creation
   // return res 


    // res.status(200).json({
    //     message:"ok",
    // })
//1.
    const {fullname, email, username, password} = req.body
    //console.log("Email:", email);
//2.
    if(fullname === ""){
        throw new ApiError(400, "fullname is required");
    }
    if(email === ""){
        throw new ApiError(400, "email is required");
    }
    if(username === ""){
        throw new ApiError(400, "username is required");
    }
    if(password === ""){
        throw new ApiError(400, "password is required");

    }
//3.
   const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
//4.
   const avatarLocalPath = req.files?.avatar[0]?.path;
   //const coverImageLocalPath = req.files?.coverImage[0]?.path;
   if(!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required")
   }
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
    coverImageLocalPath = req.files.coverImage[0].path;
   }

//5.   
   const avatar = await uploadOnCloudinary(avatarLocalPath)
   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!avatar) {
    throw new ApiError(400, "Avatar")
   }

//6.
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })   

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if(!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
   }

   return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
   )

})

export default registerUser