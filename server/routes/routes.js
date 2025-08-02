const router = require('express').Router();

// import for user controllers
const { registerUser, loginUser, getUser, getUsers, editUser, changeUserAvatar, followUnfollowUser } = require('../controllers/userControllers');
//import for post controllers
const {createPost, updatePost,deletePost,getPost,getPosts,getUserPosts,getUserBookmarks,createBookmark,likeDisLikePost,getFollowingPosts} = require('../controllers/postController');
// middleware for user controller
const authMiddleware = require('../middlewares/authMiddleware');

// ======================= User Routers ================================
// --------- POST requests ---------------------
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
// following is here for avoid conflict just bookmark only
router.get('/users/bookmarks',  getUserBookmarks);
router.post('/users/avatar', authMiddleware, changeUserAvatar);

// --------- GET requests ---------------------

router.get('/users/:id', authMiddleware,getUser);
router.get('/users', authMiddleware,getUsers);

// ---------  PATCH  requests ---------------------
router.patch('/users/edit',authMiddleware, editUser);
router.patch('/users/follow/:id', authMiddleware,followUnfollowUser);

//-----------post + user routes------------------------

router.get('/users/:id/posts', getUserPosts);

//=============================POST ROUTERS==========================

// ---------------- Post requests -------------- 

router.post('/posts',authMiddleware,createPost);
router.post('/post/:id/bookmark',createBookmark)

//------------------Get requests ----------------
router.get('/posts:id', getPost);
router.get('/posts', getPosts);
router.get('/posts/:id/like', likeDisLikePost);
router.get('/posts/following', getFollowingPosts);

//------------------Patch requests --------------
router.patch('/posts/:id',updatePost);

//------------------Delete requests -------------
router.delete('/posts/:id',deletePost);




module.exports = router;