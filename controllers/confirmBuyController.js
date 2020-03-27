const HttpError = require('../models/HttpErrorModel');

const Purchase = require('../models/PurchaseHistoryModel');

const Cart = require('../models/CartModel');

const Product = require('../models/ProductModel');

exports.confirmBuy = async (req, res, next) => {

    const { userId, token } =  req.session;

    if (token) {
        const deletedCartProducts = await Cart.delete({ userId: userId });

        console.log(deletedCartProducts);

        // const { productId } 

        // const productQuantUpdated = await Product.update


        // if (deletedCartProducts)
    }
    else {

    }
};