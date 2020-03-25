const Cart = require('../models/CartModel');

const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpErrorModel');

exports.getAllCartProducts = async (req, res, next) => {
    let allCartContents;
    try {
        allCartContents = await Cart.find();
        if (!allCartContents.isEmpty()) {
            res.json({ "Cart": allCartContents });
        }
    } catch (err) {
        const error = new HttpError('OOPS, no products in your cart, try adding few.', 500);
        return next(error);
    }
};

exports.addProductToCart = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs, please provide correct data!', 422)
        );
    }

    const { productId, quantity } = req.body;

    const { token, userId } = req.session;

    let productExistsInCart;
    try {
        // checking whether product for a user exists in the database or not
        productExistsInCart = await Cart.findOne({ productId: productId, userId: userId });    
        if (productExistsInCart) {
            var quant = productExistsInCart.quantity + quantity;
            // if product was found then update the quantity in the database
            if (token) {
                Cart.updateOne(
                {   productId : productId,
                    userId : userId
                },
                { $set : {
                    quantity : quant
                    }
                },
                function(err,product){
                    if(err)
                        res.json({result:false,message:err});
                    else
                        res.status(201).json({result:true,message:"Product quantity updated in the cart"});
                });
                
            }
        }
        else {
            const newProductForCart = new Cart({
                productId: productId,
                userId: userId,
                quantity: quantity
            });
            // save the data to the Cart model/collection
            try {
                if (token) {
                    const savedCartProduct = await newProductForCart.save();
                    console.log(savedCartProduct);
                    res.status(201).json({result:true,message:"Product added to the cart"});
                }
            } catch (err) {
                res.json({
                    result:false,
                    message: err.message
                });
            }
        }
    } catch (err) {
        res.json({ message: err.message });
        console.log(err.message);
    }
};