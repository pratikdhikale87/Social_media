const HttpError = require('../models/errorModel');

const postModel = require('../models/postModel');
const userModel = require('../models/userModel');
// const mongoose = require('mongoose');

const { v4: uuid } = require('uuid');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');


//===================CREATE POST-----------=== 1️⃣
//POST : api/posts
//protected 

const createPost = async (req, res, next) => {
     try {
          const { body } = req.body;

          // Validate post body
          if (!body) {
               return next(new HttpError('Fill the text fields and choose an image', 422));
          }

          // Validate image file
          if (!req.files || !req.files.image) {
               return next(new HttpError('Please choose an image', 422));
          }

          const image = req.files.image;

          // Rename image with UUID
          const fileExt = image.name.split('.').pop();
          const fileName = image.name.split('.')[0] + uuid() + '.' + fileExt;
          const filePath = path.join(__dirname, '..', 'uploads', fileName);

          // Save file locally
          await image.mv(filePath);

          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(filePath, {
               resource_type: 'image',
          });
          
          if (!result.secure_url) {
               return next(new HttpError('Could not upload the image', 422));
          }

          // Create post
          const newPost = await postModel.create({
               creator: req.user.id,
               body,
               image: result.secure_url,
          });

          // Update user's posts list
          await userModel.findByIdAndUpdate(newPost.creator, {
               $push: { posts: newPost._id },
          });

          res.json(newPost);
     } catch (error) {
       
          return next(new HttpError(error));
     }
};

//===================GET POST-----------=== 12️⃣
//GET : api/posts/:id
//protected 

const getPost = async (req, res, next) => {
     try {
          const { id } = req.params;

          // Validate MongoDB ObjectId
         

          const post = await postModel.findById(id);

          // after creating comment  module we have to consider this 
     //      .populate('creator')
     // .populate({
     //      path: 'comment',
     //      options: { sort: { createdAt: -1 } }
     // })

          if (!post) {
               return next(new HttpError('Post not found', 404));
          }

          res.json(post);
     } catch (error) {
          console.error('GET POST ERROR:', error);
          return next(new HttpError(error.message || 'Failed to fetch post', 500));
     }
};


//===================GET POSTS-----------=== 1️3️⃣
//GET : api/posts
//protected 

const getPosts = async (req, res, next) => {
     try {
          const posts = await postModel.find().sort({createdAt : -1});
          res.json(posts);
     } catch (error) {
          return next(new HttpError(error));
     }
}


//===================UPDATE POST-----------=== 1️4️⃣
//PATCH : api/posts/:id
//protected 

const updatePost = async (req, res, next) => {
     try {
          const postId = req.params.id;
          const { body } = req.body;

          const post = await postModel.findById(postId);

          // Check if the logged-in user is the creator
          if (!post || post.creator.toString() !== req.user.id) {
               return next(new HttpError('You are not the creator of the post', 403));
          }

          // Update the post
          const updatedPost = await postModel.findByIdAndUpdate(
               postId,
               { body },
               { new: true }
          );

          return res.status(200).json(updatedPost);
     } catch (error) {
          return next(new HttpError(error.message || 'Something went wrong'));
     }
};




//=================== DELETE POST-----------=== 5️⃣
//DELETE : api/posts/:id
//protected 

const deletePost = async (req, res, next) => {
     try {
          const postId = req.params.id;
          // check user is creator of post or not first
          const post = await postModel.findById(postId);

          if(post?.creator != req.user.id){
               return next(new HttpError('only creator of post can delete it',403));
          }

          const postDelete = await postModel.findByIdAndDelete(postId);

          if (!postDelete) {
               return next(new HttpError('Cannot delete the post', 404));
          }

           res.status(200).json({ message: 'Deleted successfully' });
           await userModel.findByIdAndDelete(post?.creator, {$pull : {posts : post?._id}});
     } catch (error) {
          return next(new HttpError(error.message || 'Something went wrong'));
     }
};



//===================FOLLOWING PEOPLE POST-----------=== 6️⃣
//GET : api/posts/following
//protected 

const getFollowingPosts = async (req, res, next) => {
     try {
          // Get only the 'following' field of the current user
          const user = await userModel
               .findById(req.user.id)
               .select('following');
               console.log(user)

          // Guard: make sure it is always an array
          const followingArr = Array.isArray(user.following) ? user.following : [];
   
          // Fetch posts created by users the current user is following
          const posts = await postModel
               .find({ creator: { $in: followingArr } })
               .sort({ createdAt: -1 }); // newest first (optional)

          
          return res.status(200).json(posts);
     } catch (error) {
          return next(new HttpError(error.message || 'Something went wrong'));
     }
};


//===================LIKE DISLIKE POST-----------=== 1️⃣
//POST : api/posts/:id/like
//protected 

const likeDisLikePost = async (req, res, next) => {
     try {
          res.json('like and dis-like Post');
     } catch (error) {
          return next(new HttpError(error));
     }
}

//===================CREATE POST-----------=== 7️⃣
//POST : api/user/:id/posts
//protected 

const getUserPosts = async (req, res, next) => {
     try {
         const userId = req.params.id;
         // now get all posts
         const posts = userModel.findById(userId).populate({path: 'posts', options: {sort : {createdAt : -1}}})
     } catch (error) {
          return next(new HttpError(error));
     }
}


//===================CREATE BOOKMARK-----------=== 1️8️⃣
//POST : api/posts/:id/bookmark
//protected 

const createBookmark = async (req, res, next) => {
     try {
         
          // creating book mark need to store bookmark on server
          const {id} = req.params;

          const user = await userModel.findById(req.user.id);
          // post is bookmarked or not 
          const postBookmarked = user?.bookmarks?.includes(id);

          if(postBookmarked){
               const userBookmark = await userModel.findByIdAndUpdate(req.user.id, {$pull : {bookmarks : id}}, {new : true});
               res.json(userBookmark);
          }else{
               const userBookmark = await userModel.findByIdAndUpdate(req.user.id, {$push : {bookmarks : id}}, {new : true});
               res.json(userBookmark);
          }

     } catch (error) {
          return next(new HttpError(error));
     }
}


//===================GET BOOKMARK-----------=== 1️9️⃣
//POST : api/bookmark
//protected 

const getUserBookmarks = async (req, res, next) => {
     try {
          // getting user bookmarks 
          const userbook = userModel.findById(req.user.id).populate({path :'bookmarks', options : {sort : {createdAt : -1}}});
          res.json(usebook);
     } catch (error) {
          return next(new HttpError(error));
     }
}



module.exports = {createPost, updatePost,deletePost,getPost,getPosts,getUserPosts,getUserBookmarks,createBookmark,likeDisLikePost,getFollowingPosts};