const HttpError = require('../middlewares/errorMiddleware');

const postModel = require('../models/postModel');
const userModel = require('../models/userModel');


const {u4: uuid} = require('uuid');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');
const path = require('path');


//===================CREATE POST-----------=== 1️⃣
//POST : api/posts
//protected 

const createPost = async(req,res,next) =>{
     try{
          res.json('create Post');
     }catch(error){
          return next(new HttpError(error));
     }
}

//===================GET POST-----------=== 12️⃣
//GET : api/posts/:id
//protected 

const getPost = async (req, res, next) => {
     try {
          res.json('get Post');
     } catch (error) {
          return next(new HttpError(error));
     }
}

//===================GET POSTS-----------=== 1️3️⃣
//GET : api/posts
//protected 

const getPosts = async (req, res, next) => {
     try {
          res.json('get all Post');
     } catch (error) {
          return next(new HttpError(error));
     }
}


//===================UPDATE POST-----------=== 1️4️⃣
//PATCH : api/posts/:id
//protected 

const updatePost = async (req, res, next) => {
     try {
          res.json('update Post');
     } catch (error) {
          return next(new HttpError(error));
     }
}


//=================== DELETE POST-----------=== 5️⃣
//DELETE : api/posts/:id
//protected 

const deletePost = async (req, res, next) => {
     try {
          res.json('delete Post');
     } catch (error) {
          return next(new HttpError(error));
     }
}


//===================FOLLOWING PEOPLE POST-----------=== 6️⃣
//GET : api/posts/following
//protected 

const getFollowingPosts = async (req, res, next) => {
     try {
          res.json('following person Posts');
     } catch (error) {
          return next(new HttpError(error));
     }
}

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
          res.json('get user Post');
     } catch (error) {
          return next(new HttpError(error));
     }
}


//===================CREATE BOOKMARK-----------=== 1️8️⃣
//POST : api/posts/:id/bookmark
//protected 

const createBookmark = async (req, res, next) => {
     try {
          res.json('create bookmark to Post');
     } catch (error) {
          return next(new HttpError(error));
     }
}


//===================GET BOOKMARK-----------=== 1️9️⃣
//POST : api/bookmark
//protected 

const getUserBookmarks = async (req, res, next) => {
     try {
          res.json('get  user bookmarks');
     } catch (error) {
          return next(new HttpError(error));
     }
}



module.exports = {createPost, updatePost,deletePost,getPost,getPosts,getUserPosts,getUserBookmarks,createBookmark,likeDisLikePost,getFollowingPosts};