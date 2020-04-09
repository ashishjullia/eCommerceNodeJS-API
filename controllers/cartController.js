const Cart = require('../models/CartModel');

const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpErrorModel');

exports.getAllCartProducts = async (req, res, next) => {
    let allCartContents;
    const { token, userId } = req.session;
    try {
        //check if user is logged in
        if(token){
            //get the cart products of the user who is logged in
            allCartContents = await Cart.find({userId : userId});
            if (allCartContents.length > 0) {
                res.json({ result : true,"Cart": allCartContents });
            }
            else{
                res.json({ result : false,message:"No products in the cart!" });
            }
        }
        else{//if the user is not logged in 
            //check if there is any product in the cart for the session
            if(req.session.cartProducts != undefined && req.session.cartProducts.length > 0){
                res.json({"Cart": req.session.cartProducts});
                return;
            }
            //no products were there in the cart
            res.json({ result:false, message:"No products in the cart!" });
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

    const { productId, cartQuantity } = req.body;

    const { token, userId } = req.session;

    let productExistsInCart;
    try {
        if (token) {
            // checking whether product for a user exists in the database or not
            productExistsInCart = await Cart.findOne({ productId: productId, userId: userId });
            // if product was found then update the quantity in the database
            if (productExistsInCart) {
                //add up the quantity to the previous value
                var quant = productExistsInCart.cartQuantity + cartQuantity;
                Cart.updateOne(
                {   productId : productId,
                    userId : userId
                },
                { $set : {
                    cartQuantity : quant
                    }
                },
                function(err,product){
                    if(err)
                        res.json({result:false,message:err});
                    else
                        res.status(201).json({result:true,message:"Product quantity updated in the cart"});
                });
            }
            else {
            const newProductForCart = new Cart({
                productId: productId,
                userId: userId,
                cartQuantity: cartQuantity
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
    }
    else {//if the user is not logged in create cart session to add products
        if (req.session.cartProducts === undefined) {
            req.session.cartProducts = [];
        }
        //check if the cart already contains the product and update the quantity
        for(var i = 0; i < req.session.cartProducts.length ; i++){
            if(req.session.cartProducts[i].productId == productId){
                req.session.cartProducts[i].cartQuantity =  req.session.cartProducts[i].cartQuantity + cartQuantity;
                
                console.log(req.session.cartProducts);
                res.status(201).json({result:true,message:"Product quantity updated in the cart"});
                return;
            }
        }
        //Add new product to the cart session if not already added
        var cartProduct = new Cart({
            productId : productId,
            userId : 0,
            cartQuantity : cartQuantity
        });

        req.session.cartProducts.push(cartProduct);
        res.status(201).json({result:true,message:"Product added to the cart"});
        console.log(req.session.cartProducts);
        }
    } catch (err) {
        res.json({ message: err.message });
        console.log(err.message);
    }
};

exports.removeProductFromCart = async (res, req, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs, please provide correct data!', 422)
        );
    }

    const { productId, allOrOne } = req.body;

    const { token, userId } = req.session;

    if (token) {
        // 0  for deleting the complete product cart and 1 for decreasing the quantity by 1
        if (allOrOne === 0) {
            const removeSingleProduct = await Cart.findOneAndDelete({ productId: productId });
            res.json({
               result: true,
               message: removeSingleProduct 
            });
            next();
        } else if (allOrOne === 1) {
            const productInFocus = await Cart.findOne({ productId: productId });
            var quant = productInFocus.cartQuantity - 1;
                Cart.updateOne(
                {   
                    productId : productId,
                    userId : userId
                },
                { $set : {
                    cartQuantity : quant
                    }
                });
            next();
        } else {
            res.json({
                result: false,
                message: "Invalid Option"
            });
        }
    }
}