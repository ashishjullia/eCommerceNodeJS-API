const express = require('express');
const router = express.Router();

// Import the "Product" model
const Product = require('../models/Product');


// GET all Products
router.get('/', async (req, res) => {
    try {
        const allProducts = await Product.find();
        res.json(allProducts);
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

    // save the data to the Product model/collection
    try {
        const savedProduct =  await product.save();
        res.json(savedProduct);
        res.json("Product has been created.");
    } catch (err) {
        res.json({
            message: err
        });
    }
    console.log("Product has been created.");
});

// GET a specific product
router.get('/:productId', async(req, res) => {
    try {
        const getSpecificProduct = await Product.findById(req.params.productId);
        res.json(getSpecificProduct);
    } catch (err) {
        res.json({message: err});
    }
});

// DELETE Or REMOVE a specific product
router.delete('/:productId', async(req, res) => {
    try {
        const removeSpecificProduct = await Product.remove({
            __id: req.params.productId
        });
        res.json(removeSpecificProduct);
    } catch (err) {
        res.json({message: err});
    }
});

// UPDATE Or MODIFY a specific product's data
router.patch('/:productId', async(req, res) => {
    try {
    const updateSpecificProduct = await Product.updateOne(
        {__id: req.params.productId},
        {$set: {
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            pricing: req.body.pricing,
            shipping: req.body.shipping,
            quantity: req.body.quantity
        }
    });
    res.json(updateSpecificProduct);
    } catch (err) {
        res.json({message: err});
    }
});

// Export
module.exports = router;