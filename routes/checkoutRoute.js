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
        check('email').not().isEmpty().isEmail().normalizeEmail(),
        check('street').not().isEmpty(),
        check('city').not().isEmpty(),
        check('province').not().isEmpty(),
        check('postalCode').not().isEmpty(),
        check('country').not().isEmpty()
    ]
    , checkout_controllers.anonymousCheckout);


// Export
module.exports = router;