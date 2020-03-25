const Address = require('../models/AddressModel');

const HttpError = require('../models/HttpErrorModel');

const { validationResult } = require('express-validator');

// GET all addresses
exports.getAllAddresses = async (req, res, next) => {
    let allAddresses;
    try {
        allAddresses = await Address.find();
        if (!allAddresses.isEmpty) {
            res.json({ "Addresses": allAddresses });
        }
    } catch (err) {
        const error = new HttpError('No addresses found!', 500);
        return next(error);
    }
};

// Add a new address
exports.addAddress = async (req, res, next) => {
    // Validating the data before creating or adding the address
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return next(
            new HttpError('Invalid inputs, please provide correct data!', 422)
        );
    }

    const { addressId, street, city, province, postalCode, country } = req.body;

    const { token, userId } = req.session;

    if (token) {
        // Check whether an address for a user already exists or not.
        let addressExists;
        try {
            addressExists = await Address.findOne({ addressId: addressId });
        } catch (err) {
            const error = new HttpError('unable to add address at this moment.', 500);
            return next(error);
        }

        if (addressExists) {
            const error = new HttpError('This Address is already added.', 422);
            return next(error);
        }

        // creating a new address 
        const newAddress = new Address({
            addressId: addressId,
            userId: userId,
            street: street,
            city: city,
            province: province,
            postalCode: postalCode,
            country: country
        });

        try {
            const savedNewAddress = await newAddress.save();
            res.json(201).json(savedNewAddress);
        } catch (err) {
            res.json({
                message: err
            });
        }
    }
    else {
        const error = new HttpError('Cannot add address, because the user is not logged in.', 422);
        res.json({ message: error });
    }
};