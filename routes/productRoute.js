const express = require('express');
const router = express.Router();

const products_controller = require('../controllers/productController');

const { check } = require('express-validator');

router.get('/', products_controller.getAllProducts);

router.post('/', 
    [
        check('title').not().isEmpty(),
        check('description').not().isEmpty(),
        check('image').not().isEmpty(),
        check('pricing').not().isEmpty(),
        check('shipping').not().isEmpty(),
        check('quantity').not().isEmpty()
    ], 
    products_controller.addProduct);

router.get('/:productId', products_controller.getSpecificProductFromCart);

router.delete('/:productId', products_controller.removeSpecificProduct);

router.patch('/:productId', products_controller.updateSpecificProductInCart);

module.exports = router;