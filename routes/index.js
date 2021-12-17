const express = require('express');
const userController = require('../controller/userController');
const postController = require('../controller/postController');
const commentController = require('../controller/commentController');
const likeController = require('../controller/likeController');
const isLoggedIn = require('../middlewares/authentication');
const upload = require('../middlewares/upload');
const {userValidationRules, updateUserValidationRules, postValidationRules, commentValidationRules, validate} = require('../middlewares/validator');


const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).json({
        message: 'أهلًا بالعالم'
    })
})

// User Routes
router.post('/account/register', userValidationRules(), validate, userController.register);
router.post('/account/login', userController.login);
router.get('/account/profile', isLoggedIn, userController.getProfile);
router.put('/account/profile/upload-photo', upload.single('avatar'), isLoggedIn, userController.uploadUserPhoto);
router.put('/account/profile/update-profile', updateUserValidationRules(), validate, isLoggedIn, userController.updateProfile);

// Post Routes
router.post('/posts/create', upload.array('postImg', 5), postValidationRules(), validate, isLoggedIn, postController.newPost);
router.get('/posts', isLoggedIn, postController.getAllPosts);
router.get('/posts/:postId', isLoggedIn, postController.getPost);
router.get('/my-posts', isLoggedIn, postController.getAllMyPosts);
router.get('/my-posts/:postId', isLoggedIn, postController.getMyPost);
router.put('/my-posts/:postId/update', postValidationRules(), validate, isLoggedIn, postController.updateMyPost);
router.delete('/my-posts/delete', isLoggedIn, postController.deleteMyPost);

// Comment Routes
router.post('/posts/:postId/create-comment', commentValidationRules(), validate, isLoggedIn, commentController.creteComment);
router.get('/posts/:postId/get-comments', isLoggedIn, commentController.getComments);

// Like Routes
router.put('/posts/:postId/like', isLoggedIn, likeController.like);
router.get('/posts/:postId/like-count', isLoggedIn, likeController.likeCount);

module.exports = router;