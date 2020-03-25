const express = require('express');
const router = express.Router();

const checkout_controllers = require('../controllers/cartController');

const { check } = require('express-validator');


router.post('/', checkout_controllers.checkout);


// Export
module.exports = router;