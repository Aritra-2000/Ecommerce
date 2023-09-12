import ErrorHandler from '../utils/ErrorsHandler.js';
import {catchAsyncError} from "../middleware/catchAsyncError.js";
import {User} from '../models/userModel.js';
import sendToken from '../utils/jwtToken.js';
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary";


// Regiser a user
export const registerUser = catchAsyncError(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder:"avatars",
      width: 150,
      crop: "scale"
    })

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });

    sendToken(user, 201, res)
})



// Login User
export const loginUser = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body

    // checking if user has given pass and mail

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email && Password", 400));

    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401));

    }

    const isPasswordMatched = user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);

})


// Logout user 
export const logout = catchAsyncError(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged Out "
    });

})



// Forget Password
export const forgotPassword = catchAsyncError(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    // Get ResetPassword
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});


    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Your Password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignor it`;

    // try {

    await sendEmail(user.email, "Eccomerce Reset Password", message);

    res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,

    })



    // } catch (error) {
    //     user.resetPasswordToken = undefined;
    //     user.resetPasswordExpire = undefined;

    //     await user.save({validateBeforeSave: false});

    //     return next(new ErrorHandler(error.message, 500));

    // }

})


// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {

    const { token } = req.params;

    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    })

    if (!user) {
        return next(new ErrorHandler("Token is Invalid or has been expire", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400))
    }

    user.password = req.body.password;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password Changed Successfully",
    });
})


// Get User Details
export const getUserDetails = catchAsyncError(async (req, res, next) => {

    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})


// update user password
export const updatePassword = catchAsyncError(async (req, res, next) => {

    const {oldPassword, newPassword, confirmPassword} = req.body;

    if(!oldPassword || !newPassword){
        return next(new ErrorHandler("Please enter all field", 400));
    }
   
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if(newPassword !== confirmPassword){
        return next(new ErrorHandler("Password does not match", 400));

    } 

    user.password = newPassword;

    await user.save()

    sendToken(user, 200, res);
});



// update user Profile
export const updatePofile = catchAsyncError(async (req, res, next) => {

    // const {name , email} = req.body

    const newUserData={
        name:req.body.name,
        email:req.body.email 
    }

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder:"avatars",
            width: 150,
            crop: "scale"
        })
        
        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }

    }

    // const user = await User.findById(req.user.id);

    // if(name) user.name=name;
    // if(email) user.email=email;
    
    // await user.save();

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    })

    res.status(200).json({
        success:true,
        message:"Profile Updated Successfully"
    })
})


// Get single Users (admin)
export const getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});


// Get single User (admin)
export const getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`))
    }

    res.status(200).json({
        success: true,
        user,
    });
});


// Update User role --Admin
export const updateUserRole = catchAsyncError(async (req, res, next) => {

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User Does not exists with Id: ${req.params.id}`),404)
    }

    user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        userFindAndModify: false,
    });


    res.status(200).json({
        success:true,
    })
})


// Delete User -Admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
   
    const user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`User Does not exists with Id: ${req.params.id}`))
    }

    const imageId = user.avatar.public_id;
       
    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully"
    })
})