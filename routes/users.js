const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users_controller');
const passport = require('passport');

router.get('/profile/:id',passport.checkAuthentication,usersController.profile);
router.get('/signup',usersController.signup);
router.get('/signin',usersController.signin);
router.post('/create',usersController.create);
router.get('/userHome',passport.checkAuthentication,usersController.userHome);
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/users/signin'},
), usersController.createSession);


router.post('/update/:id',passport.checkAuthentication,usersController.updateProfile);

router.get('/signout',passport.checkAuthentication,usersController.destroySession);


module.exports = router;