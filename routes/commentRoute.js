const express = require('express');
const router = express.Router();

const comment_controllers = require('../controllers/commentController');

const { check } = require('express-validator');

router.get('/', comment_controllers.comments);

// Export
module.exports = router;