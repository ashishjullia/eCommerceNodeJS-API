const Product = require('../models/ProductModel');
const { check } = require('express-validator');

const HttpError = require('../models/HttpErrorModel');

const { validationResult } = require('express-validator');

// GET all Products
exports.getAllProducts = async (req, res, next) => {
    let allProducts;
    try {
        allProducts = await Product.find();
        if (allProducts.length > 0) {
            res.json({ "Products": allProducts });
        } else {
            res.json({ result: "false",
                       message: "No products found" });
        }
    } catch (err) {
        const error = new HttpError('OOPS, there are no products to show at this time.', 500);
        //const error = err;
        return next(error);
    }
};

// ADD a single product
exports.addProduct = async (req, res, next) => {
    // Validating the data before adding it
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs, please provide correct data!', 422)
        );
    }

    const { title, description, image, pricing, shipping, quantity } = req.body;
    
    // Check whether the product is already registered or not
    let productExists;
    try {
        productExists = await Product.findOne({ title: title }); 
    } catch (err) {
        res.json({message: err.message});
        // const error = new HttpError('Product adding failed.', 422);
        // return next(error);
    }

    if (productExists) {
        const error = new HttpError('Product aleardy added, duplicate.', 422);
        return next(error);
    }

    // creating a new user from the data being sent via post request
    const newProduct = new Product({
        title: title,
        description: description,
        image: image,
        pricing: pricing,
        shipping: shipping,
        quantity: quantity
    });

    // save the data to the Product model/collection
    try {
        const saveProduct =  await newProduct.save();
        res.status(201).json(saveProduct);
    } catch (err) {
        res.json({
            message: err
        });
    }
};


// GET a specific product
exports.getSpecificProductFromCart = async(req, res) => {
    try {
        const getSpecificProductFromCart = await Product.findById(req.params.productId);
        res.json(getSpecificProductFromCart);
    } catch (err) {
        res.json({message: err});
    }
}

// DELETE Or REMOVE a specific product
exports.removeSpecificProduct = async(req, res) => {
    try {
        const removeSpecificProduct = await Product.remove({
            _id: req.params.productId
        });
        res.json(removeSpecificProduct);
    } catch (err) {
        res.json({message: err});   
    }
}

// UPDATE Or MODIFY a specific product's data
exports.updateSpecificProductInCart = async(req, res) => {
    try {
    const updateSpecificProductInCart = await Product.updateOne(
        {_id: req.params.productId},
        {$set: {
            title: req.body.title,
            description: req.body.description,
            image: req.body.image,
            pricing: req.body.pricing,
            shipping: req.body.shipping,
            quantity: req.body.quantity
        }
    });
    res.json(updateSpecificProductInCart);
    } catch (err) {
        res.json({message: err});
    }
}