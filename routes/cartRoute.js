const express = require('express');
const router = express.Router();

const cart_controllers = require('../controllers/cartController');

const { check } = require('express-validator');

// GET current cart's all contents
router.get('/', cart_controllers.getAllCartProducts);

//router.use(auth);

// ADD a product to cart
router.post('/',
    [
        check('productId').not().isEmpty(),
        check('cartQuantity').not().isEmpty()
    ],
    cart_controllers.addProductToCart);

router.delete('/removeProduct',
    [
        check('productId').not().isEmpty(),
        check('allOrOne').not().isEmpty()
    ],
    cart_controllers.removeProductFromCart);

// Export
module.exports = router;