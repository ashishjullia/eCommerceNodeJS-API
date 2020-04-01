const HttpError = require('../models/HttpErrorModel');

const Purchase = require('../models/PurchaseHistoryModel');

const Cart = require('../models/CartModel');

const Product = require('../models/ProductModel');

const Address = require('../models/AddressModel');

const User = require('../models/UserModel');

exports.confirmBuy = async (req, res, next) => {

    const { userId, token, email } =  req.session;
    console.log(userId);
    console.log(token);
    console.log(email);

    try {
        if (token) {
            const cartObject = await Cart.findOne({ userId: userId });
            // { cartQuantity, productId }
            const productObject = await Product.findOne({ _id: cartObject.productId });
            // { quantity, pricing }

            console.log(productObject.quantity);
            console.log(cartObject.cartQuantity);
            console.log(productObject.pricing);
            console.log(cartObject.productId);

            if (productObject.quantity > cartObject.cartQuantity) {
                await Product.updateOne(
                    { _id: cartObject.productId },
                    { $set: {
                        quantity: productObject.quantity - cartObject.cartQuantity
                    }
                });

                // Delete from the cart
                await Cart.deleteOne({ userId: userId });

                const addressObject = await Address.findOne({ userId: userId });

                // Add to the purchase history
                const updatePurchaseHistory = new Purchase({
                    username: email,
                    productId: cartObject.productId,
                    quantity: cartObject.cartQuantity,
                    price: productObject.pricing,
                    street: addressObject.street,
                    city: addressObject.city,
                    province: addressObject.province,
                    postalCode: addressObject.postalCode,
                    country: addressObject.country
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
        else {
            res.json({
                return: false,
                message: "No user is logged in."
            });
            next();
        }
    } catch (err) {
        res.json({ return: false,
        message: err.message });
    }
};