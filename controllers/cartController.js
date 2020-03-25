const Cart = require('../models/CartModel');

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