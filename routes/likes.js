const express = require('express');
const router = express.Router();


const likescontroller = require('../controllers/likes_cotroller');
router.post('/toggle',likescontroller.toggleLike);

module.exports = router;