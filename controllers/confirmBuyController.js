const HttpError = require('../models/HttpErrorModel');

const Purchase = require('../models/PurchaseHistoryModel');

const Cart = require('../models/CartModel');

const Product = require('../models/ProductModel');

const Address = require('../models/AddressModel');

const User = require('../models/UserModel');

exports.confirmBuy = async (req, res, next) => {

    const { email, token, checkOutItems, address } =  req.session;

    try {
        if (token) {
            confirmBuyProduct(email, checkOutItems, address, req, res, next);
        }
        else {
            confirmBuyProduct(email, checkOutItems, address, req, res, next);
        }
    } catch (err) {
        res.json({ return: false,
        message: err.message });
    }
};


async function confirmBuyProduct(email, checkOutItems, address, req, res, next) { 
     const cartObject = await Cart.findOne({ userId: email });
            // // { cartQuantity, productId }
            const productObject = await Product.findOne({ _id: cartObject.productId });
            // // { quantity, pricing }

            // console.log(productObject.quantity);
            // console.log(cartObject.cartQuantity);
            // console.log(productObject.pricing);
            // console.log(cartObject.productId);

            if (productObject.quantity > checkOutItems.cartQuantity && checkOutItems.cartQuantity > 0) {
                await Product.updateOne(
                    { _id: checkOutItems.productId },
                    { $set: {
                        quantity: productObject.quantity - checkOutItems.cartQuantity
                    }
                });

                // Delete from the cart
                await Cart.deleteOne({ userId: userId });

                // const addressObject = await Address.findOne({ userId: userId });

                // Add to the purchase history
                const updatePurchaseHistory = new Purchase({
                    username: email,
                    productId: checkOutItems.productId,
                    quantity: checkOutItems.cartQuantity,
                    price: productObject.pricing,
                    street: address.street,
                    city: address.city,
                    province: address.province,
                    postalCode: address.postalCode,
                    country: address.country
                });

                const purchased = await updatePurchaseHistory.save();
                console.log(purchased);
                res.json({
                    return: true,
                    message: "purchased"
                });
                next();
            } else {
                res.json({ 
                    return: false,
                    message: "Not in stock."
                });
                next();
            }
}