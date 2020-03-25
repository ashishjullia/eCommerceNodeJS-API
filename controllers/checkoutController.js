const Cart = require('../models/CartModel');

const User = require('../models/UserModel');

const Product = require('../models/ProductModel');

const PurchaseHistory = require('../models/PurchaseHistoryModel');

const Address = require('../models/AddressModel');

const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpErrorModel');


exports.checkout = async (req, res, next) => {
    const errors = validationResult(req);

    const { addressId } = req.body;
    let allCartcontents, username, product, address;
    const { token, userId } = req.session;
    try {
        if (token) {
            username = await User.find(
                { userId: userId },
                { fields: {
                    email
                } }  );
            allCartcontents = await Cart.find({ userId: userId });
            product = await Product.find({ _id: allCartContents.productId });
            address = await Address.find({ addressId: addressId });
            if (allCartcontents.isEmpty) {
                res.json({ message: "Your cart is empty, cannot checkout!" });
            } 
            else {
                const newPurchase = new PurchaseHistory({
                    username: username,
                    productId: allCartcontents.productId,
                    quantity: allCartcontents.quantity,
                    price: product.quantity,
                    street: address.street,
                    city: address.city,
                    province: address.province,
                    postalCode: address.postalCode,
                    country: address.country
                })
            }
        }
        else {
            res.json({ message: "Not logged in." });
        }
    } catch (err) {
        next();
    }

}; 