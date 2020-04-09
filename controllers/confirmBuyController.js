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
            confirmBuyProduct(email, checkOutItems, address, req, res, next,token);
        }
        else {
            confirmBuyProduct(email, checkOutItems, address, req, res, next,token);
        }
    } catch (err) {
        res.json({ return: false,
        message: err.message });
    }
};


async function confirmBuyProduct(email,checkOutItems, address, req, res, next,token) { 
    console.log(checkOutItems);
    for(var i = 0;i < checkOutItems.length ; i++){
        const product = await Product.findOne({_id : checkOutItems[i].productId});
        await Product.updateOne(
            { _id: checkOutItems[i].productId },
            { $set: {
                quantity: product.quantity- checkOutItems[i].cartQuantity
                }
            },
            function(err,product){
                if(err)
                    res.json({result:false,message:err});
                else
                    console.log("product Quantity updated");
            });
    }
    if(token){
        // Delete from the cart
        await Cart.deleteOne({ userId: req.session.userId });
    }
    else{
        //remove products from the session when not logged in
        req.session.cartProducts = undefined;
    }
    // const addressObject = await Address.findOne({ userId: userId });

    // Add to the purchase history
    for(var i = 0; i < checkOutItems.length; i++){
        const product = await Product.findOne({_id : checkOutItems[i].productId});
        const updatePurchaseHistory = new Purchase({
            username: email,
            productId: checkOutItems[i].productId,
            quantity: checkOutItems[i].cartQuantity,
            price: product.pricing,
            street: address.street,
            city: address.city,
            province: address.province,
            postalCode: address.postalCode,
            country: address.country
        });

        const purchased = await updatePurchaseHistory.save();
    }
    req.session.checkOutItems = undefined;
    req.session.address = undefined;

    res.json({
        return: true,
        message: "Transaction completed, consistency maintained"
    });
}