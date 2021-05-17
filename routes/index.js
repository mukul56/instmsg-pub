const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home_controller');

//console.log("router loaded");

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/posts',require('./post'));
router.use('/api',require('./api'));
router.use('/likes',require('./likes'))
router.use('/friends',require('./friends'));

module.exports = router;