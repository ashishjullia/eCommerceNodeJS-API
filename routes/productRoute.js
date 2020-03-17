const express = require('express');
const router = express.Router();

const products_controller = require('../controllers/productController');

router.get('/', products_controller.getAllProducts);

router.post('/', products_controller.postSingleProduct);

router.get('/:productId', products_controller.getSpecificProduct);

router.delete('/:productId', products_controller.removeSpecificProduct);

router.patch('/:productId', products_controller.updateSpecificProduct);

module.exports = router;