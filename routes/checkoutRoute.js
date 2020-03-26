const express = require('express');
const router = express.Router();

const checkout_controllers = require('../controllers/checkoutController');

const { check } = require('express-validator');


router.post('/',
    [
        check('addressId').not().isEmpty()
    ]
    , checkout_controllers.checkout);

router.post('/anonymous',
    [
        
    ]
    , checkout_controllers.anonymousCheckout);


// Export
module.exports = router;