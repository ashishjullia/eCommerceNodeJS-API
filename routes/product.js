const express = require('express');
const router = express.Router();

// Import the "Product" model
const Product = require('../models/Product');


// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// POST a product
router.post('/', async (req, res) => {
    
    // creating a new product from the data being sent via a post request
    const product = new Product({
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        pricing: req.body.pricing,
        shipping: req.body.shipping,
        quantity: req.body.quantity
    });

    // save the data to the Product model
    try {
        const savedProduct =  await product.save();
        res.json(savedProduct);
    } catch (err) {
        res.json({
            message: err
        });
    }

    console.log("posted");
});

// Export
module.exports = router;