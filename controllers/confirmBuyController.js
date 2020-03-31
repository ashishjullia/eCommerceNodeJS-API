const HttpError = require('../models/HttpErrorModel');

const Purchase = require('../models/PurchaseHistoryModel');

const Cart = require('../models/CartModel');

const Product = require('../models/ProductModel');

exports.confirmBuy = async (req, res, next) => {

    const { userId, token } =  req.session;

    if (token) {
        const { productId, cartQuantity } = await Cart.find({ userId: userId });
        var cartQuant = cartQuantity;

        // Decrease product quantity in database
        const productQuantityDecrease = await Product.updateOne(
            { productId: productId },
            { $set: {
                quantity: quantity - quant
            }
        });

        // const { productId } 

        // const productQuantUpdated = await Product.update


        // if (deletedCartProducts)
    }
    else {

    }
};