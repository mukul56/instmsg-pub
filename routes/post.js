const express = require('express'); 
const router = express.Router();
const postsController = require('../controllers/posts_controller');
const passport = require('passport');



router.post('/createposts',passport.checkAuthentication,postsController.createPost);
router.post('/create-comment',passport.checkAuthentication,postsController.createComment);
router.get('/destroy/:id',passport.checkAuthentication,postsController.destroy);
router.get('/destroy-comment/:id',passport.checkAuthentication,postsController.destroyComment);

module.exports = router;