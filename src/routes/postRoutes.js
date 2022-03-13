const router = require('express').Router();
const authController = require('../controllers/authController');
const postController = require('../controllers/postController');


 router.use(authController.protect);


router.route('/me')
.get(postController.getPost)
.post(postController.createPost)
router.route('/me/:id')
.put(postController.updatePost)
.delete(postController.deletePost);

router.use(authController.restrictTo("admin", "superAdmin"));
router.get('/admin',postController.getAllPostsByAdmin)
router.delete('/admin/:id', postController.deletePostByAdmin)



module.exports = router;