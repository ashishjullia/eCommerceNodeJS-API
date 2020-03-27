const Cart = require('../models/CartModel');

const User = require('../models/UserModel');

const Product = require('../models/ProductModel');

const PurchaseHistory = require('../models/PurchaseHistoryModel');

const Address = require('../models/AddressModel');

const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpErrorModel');

const OutOfStock = require('../models/OutOfStockModel');

exports.checkout = async (req, res, next) => {
    const errors = validationResult(req);
    
    const { token, userId } = req.session;

    try {
        // if the user is logged in
        if (token) {
                
            const { addressId } = req.body;
            //get the user address
            const address = await Address.findOne({ _id: addressId });
            //check if address and checkoutitems have been initialized earlier
            if(req.session.address === undefined){
                req.session.address = {};
            }
            //add address to the session for future use
            req.session.address = address;

            const cartProducts =  await Cart.find({ userId: userId });                    
            checkOutItems(cartProducts,req,res,next);
        } 
        else {
            if (req.session != undefined && req.session.cartProducts != undefined && req.session.cartProducts.length > 0) {
                const cartProducts = req.session.cartProducts;
                checkOutItems(cartProducts, req, res, next);
                res.status(422).json({result:false,message :"No user logged in,Go for anonymous buy! "});
                return;
            }
            else{
                res.status(422).json({result:false,message :"No products for current session "});
                return;
            }
        }
    } catch (err) {
        res.json({ message: err.message });
    }
}; 

exports.anonymousCheckout = async (req, res, next) => {
    const errors = validationResult(req);
    
    const { email, street, city, province, postalCode, country } = req.body;
    
    if (req.session != undefined) {
        try {
            console.log(req.session);
            if (req.session.cartProducts != undefined && req.session.cartProducts.length > 0) {
                console.log("hello")
                
                req.session.email = email;
                var anonymous = new Address( {
                    userId: "",
                    street: street, 
                    city: city, 
                    province: province, 
                    postalCode: postalCode, 
                    country: country });

                req.session.address = anonymous;
                // console.log(anonymous);
                res.json({ result: true, message: "Address added!" });
            } 
        }   catch (err) {
                res.json({ message: err.message });
            }
        }
};

async function checkOutItems(cartProducts,req,res,next) {
    var arrayProductIds = [];
    var arrayOutOfStock = [];
    //loop over products to create product Ids array 
    for (i = 0; i < cartProducts.length; i++) {
        arrayProductIds.push(cartProducts[i].productId);
    }
    //get the products' details from the table using the ids array
    const products = await Product.find({ _id: {$in:  arrayProductIds}});        

    for (i = 0; i < cartProducts.length; i ++) {
        for (j = 0; j < products.length; j ++) {
            //check for the product Id to match the quantity
            if(cartProducts[i].productId == products[j]._id) {
                //if available quantity is less than cart quantity add it to the out of stock products
                if (cartProducts[i].quantity > products[j].quantity)
                {
                    var outOfStock = new OutOfStock(
                        products[j]._id,
                        cartProducts[i].quantity,
                        products[j].quantity
                    );
                    arrayOutOfStock.push(outOfStock);
                }
            }
        }
    }
    //check if any cart products was out of stock
    if(arrayOutOfStock.length > 0){
        res.status(422).json({result:false,"OutOfStockProducts" : arrayOutOfStock});
        return;
    }
    else{
        //if in stock then proceed to confirm buy option
        if(req.session.checkOutItems === undefined){
            req.session.checkOutItems = {};
        }
        //add address and checkoutItems to the session for future use
        //while confirming / after the payment gateway has been called
        //this is to be done to update the purchase history table and cart table
        req.session.checkOutItems = cartProducts;
        
        console.log(req.session);
        res.status(422).json({result:true,message :"Proceed to confirm buy"});
        return;
    }
}