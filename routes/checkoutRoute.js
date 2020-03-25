const express = require('express');
const router = express.Router();

const checkout_controllers = require('../controllers/cartController');

const { check } = require('express-validator');


router.post('/'
    [
        check('addressId').not().isEmpty()
    ]
    , checkout_controllers.checkout);


// Export
module.exports = router;