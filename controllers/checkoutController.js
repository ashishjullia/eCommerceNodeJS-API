const Cart = require('../models/CartModel');

const PurchaseHistory = require('../models/PurchaseHistoryModel');

const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpErrorModel');


exports.checkout = async (req, res, next) => {
    const errors = validationResult(req);
    
}; 