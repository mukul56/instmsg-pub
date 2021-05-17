const express = require('express');
const router = express.Router();


const friendscontroller = require('../controllers/friends_controller');
router.get('/toggle',friendscontroller.toggleFriend);
router.get('/remove/:id',friendscontroller.removeFriend);

module.exports = router;