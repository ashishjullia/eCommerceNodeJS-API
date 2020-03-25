const express = require('express');
const router = express.Router();

const cart_controllers = require('../controllers/cartController');

const auth = require('../middleware/auth');

const { check } = require('express-validator');

// GET current cart's all contents
router.get('/', cart_controllers.getAllCartProducts);

//router.use(auth);

// ADD a product to cart
router.post('/',
    [
        check('productId').not().isEmpty(),
        check('quantity').not().isEmpty()
    ],
    cart_controllers.addProductToCart);

// Export
module.exports = router;