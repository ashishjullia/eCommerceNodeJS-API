const express = require('express');
const router = express.Router();

const address_controllers = require('../controllers/addressController');

const { check } = require('express-validator');

// GET all addresses
router.get('/', address_controllers.getAllAddresses);

// ADD an address
router.post('/',
    [
        check('addressId').not().isEmpty(),
        check('street').not().isEmpty(),
        check('city').not().isEmpty(),
        check('province').not().isEmpty(),
        check('postalCode').not().isEmpty(),
        check('country').not().isEmpty()
    ],
    address_controllers.addAddress);

// Export
module.exports = router;