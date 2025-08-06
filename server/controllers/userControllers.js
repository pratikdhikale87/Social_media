// all user controller are here 
const HttpError = require('../models/errorModel');
const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const uuid = require('uuid').v4;

//for uploading file in server 
const fs = require('fs');
const path = require('path');

// cloudinary 
const cloudinary = require('../utils/cloudinary');



// ========= register user =================
// POST: api/users/register
// UNPROTECTED 

const registerUser = async (req, res, next) => {
     try {
          const { fullName, email, password, confirmPassword } = req.body;
         
          if (!fullName || !email || !password || !confirmPassword) {
               return next(new HttpError('Please fill all fields in the form', 422));
          }

          const lowerEmail = email.toLowerCase();
          const checkEmail = await userModel.findOne({ email: lowerEmail });

          if (checkEmail) {
               return next(new HttpError('Email already exists', 409));
          }

          if (password !== confirmPassword) {
               return next(new HttpError('Passwords do not match', 400));
          }

          if (password.length < 8) {
               return next(new HttpError('Password must be at least 8 characters long', 400));
          }

          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = await userModel.create({ fullName, email: lowerEmail, password: hashedPassword });

          return res.status(201).json("user created successfully...");
     } catch (error) {
          return next(new HttpError(error.message || 'Something went wrong', 500));
     }
};


// ========= Login user =================
// POST: api/users/login
// UNPROTECTED 

const loginUser = async (req, res, next) => {
     try {
          const { email, password } = req.body;

          if (!email || !password) {
               return next(new HttpError('Please check all fields', 422));
          }

          const lowerEmail = email.toLowerCase();
          const user = await userModel.findOne({ email: lowerEmail });

          if (!user) {
               return next(new HttpError('Invalid email or password', 400));
          }

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) {
               return next(new HttpError('Invalid email or password', 400));
          }

          const token = jwt.sign(
               { id: user._id },
               process.env.JWT_SECRET,
               { expiresIn: '1h' }
          );

          

          res.status(200).json({ token, id: user._id });

     } catch (error) {
          return next(new HttpError(error.message, 500));
     }
};
   



// ========= Get user details(main user) =================
// GET: api/users/:id
// PROTECTED 

const getUser = async (req, res, next) => {
     try {
          const {id} = req.params;
          // get the user 
          const user = await userModel.findById(id);
          // if user not get
          if(!user){
               return next(new HttpError('user not found', 404));
          }
          res.status(200).json(user);
     } catch (error) {
          return next(new HttpError(error));
     }
};


// ========= get users (other user details of main page) =================
// GET: api/users
// PROTECTED 

const getUsers = async (req, res, next) => {
     try {
          const users = await userModel.find().limit(10).sort({createdAt : -1});

          if(!users){
               return  next(new HttpError("Something went wrong", 404));
          }
          res.status(200).json(users);
     } catch (error) {
          return next(new HttpError(error));
     }
};


// ========= Edit user =================
// PATCH : api/users/edit
// PROTECTED 

const editUser = async (req, res, next) => {
     try {
          const { fullName, bio } = req.body;

          // Optional: Validate input here (e.g., check if fullName is not empty)

          const isUpdated = await userModel.findByIdAndUpdate(
               req.user.id,
               { fullName, bio },
               { new: true, runValidators: true }
          );

          if (!isUpdated) {
               return next(new HttpError('User not found or update failed', 404));
          }

          res.status(200).json(isUpdated);
     } catch (error) {
          return next(new HttpError(error.message || 'Something went wrong', 500));
     }
};
 


// =========  user follow- unfollow =================
// GET: api/users/:id/follow-unfollow
// UNPROTECTED 
const followUnfollowUser = async (req, res, next) => {
     try {
          const followUserId = req.params.id;

          // Prevent self-follow/unfollow
          if (req.user.id === followUserId) {
               return next(new HttpError("You can't follow yourself", 422));
          }

          // Get current user
          const currUser = await userModel.findById(req.user.id);

          // Check if already following
          const isFollowing = currUser?.following?.includes(followUserId);

          if (!isFollowing) {
               // Follow user
               await userModel.findByIdAndUpdate(followUserId, {
                    $push: { follower: req.user.id }
               }, { new: true });

               await userModel.findByIdAndUpdate(req.user.id, {
                    $push: { following: followUserId }
               }, { new: true });

               return res.status(200).json({ message: "User followed successfully" });
          } else {
               // Unfollow user
               await userModel.findByIdAndUpdate(followUserId, {
                    $pull: { follower: req.user.id }
               }, { new: true });

               await userModel.findByIdAndUpdate(req.user.id, {
                    $pull: { following: followUserId }
               }, { new: true });

               return res.status(200).json({ message: "User unfollowed successfully" });
          }

     } catch (error) {
          return next(new HttpError(error.message || "Something went wrong", 500));
     }
};
 


// =========  user follow- unfollow =================
// POST: api/users/avatar
// PROTECTED 

const changeUserAvatar = async (req, res, next) => {
     try {
          if (!req.files || !req.files.avatar) {
               return next(new HttpError('Please select a file', 422));
          }

          const { avatar } = req.files;

          if (avatar.size > 5000000) {
               return next(new HttpError('File size is too big.'));
          }

          const fileName = avatar.name;
          const spiltName = fileName.split('.');
          const newFileName = spiltName[0] + uuid() + '.' + spiltName[spiltName.length - 1];

          const filePath = path.join(__dirname, '..', 'uploads', newFileName);

          avatar.mv(filePath, async (error) => {
               if (error) {
                    return next(new HttpError(error));
               }

               try {
                    const result = await cloudinary.uploader.upload(filePath, {
                         resource_type: "image"
                    });

                    if (!result.secure_url) {
                         return next(new HttpError("Couldn't upload image to Cloudinary", 422));
                    }

                    const updatedUser = await userModel.findByIdAndUpdate(
                         req.user.id,
                         { profilePhoto: result.secure_url },
                         { new: true }
                    );

                    res.status(200).json(updatedUser);
               } catch (err) {
                    return next(new HttpError(err));
               }
          });
     } catch (error) {
          return next(new HttpError(error));
     }
};


// exporting all modules

module.exports = {registerUser, loginUser, getUser, getUsers, editUser,changeUserAvatar, followUnfollowUser};