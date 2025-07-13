const router = require('express').Router();

// import for user controllers
const { registerUser, loginUser, getUser, getUsers, editUser, changeUserAvatar, followUnfollowUser } = require('../controllers/userControllers');
// middleware for user controller
const authMiddleware = require('../middlewares/authMiddleware');

// ======================= User Routers ================================
// --------- POST requests ---------------------
router.post('/users/register', registerUser);
router.post('/users/login', loginUser);
router.post('/users/avatar', changeUserAvatar);

// --------- GET requests ---------------------

router.get('/users/:id', getUser);
router.get('/users', getUsers);

// ---------  PATCH  requests ---------------------
router.patch('/users/edit',authMiddleware, editUser);
router.patch('/users/follow/:id', authMiddleware,followUnfollowUser);


module.exports = router;