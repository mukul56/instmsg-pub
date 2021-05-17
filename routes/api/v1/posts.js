const express = require('express');
const router = express.Router();
const postsController = require('../../../controllers/api/v1/posts_api');
const passport = require('passport');

router.get('/',postsController.index);
router.delete('/:id',passport.authenticate('jwt',{session : false}),postsController.destroy);

module.exports = router;