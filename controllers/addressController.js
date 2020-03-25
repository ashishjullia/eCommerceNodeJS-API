const Address = require('../models/AddressModel');

const HttpError = require('../models/HttpErrorModel');

const { validationResult } = require('express-validator');

// GET all addresses
exports.getAllAddresses = async (req, res, next) => {
    let allAddresses;
    const { token, userId } = req.session;
    try {
        // check if the user is logged in
        if (token) {
            allAddresses = await Address.find({ userId: userId });
            if (!allAddresses.isEmpty) {
                res.json({ "Addresses": allAddresses });
            }
        }
        // else {
        //     //if the user is not logged in 
        //     //check if there is any address in the session for current logged in user
        //     if (req.session != undefined && req.session != null) {
        //         res.json( { "Address": {
        //             userId: userId,
        //             street: street,
        //             ciy: city,
        //             province: province,
        //             postalCode: postalCode,
        //             country: country
        //         } });
        //     }
        // }
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

    const { street, city, province, postalCode, country } = req.body;

    const { token, userId } = req.session;

    if (token) {
        // Check whether an address for a user already exists or not.
        let addressExists;
        try {
            addressExists = await Address.findOne({ 
                userId: userId.toLowerCase(), 
                street: street.toLowerCase(), 
                city: city.toLowerCase(), 
                province: province.toLowerCase(), 
                postalCode: postalCode.toLowerCase(), 
                country: country.toLowerCase() });
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
            userId: userId.toLowerCase(),
            street: street.toLowerCase(),
            city: city.toLowerCase(),
            province: province.toLowerCase(),
            postalCode: postalCode.toLowerCase(),
            country: country.toLowerCase()
        });

        try {
            const savedNewAddress = await newAddress.save();
            res.status(201).json({result:true,message:"Address added!"});
        } catch (err) {
            res.json({
                message: err
            });
        }
    }
    // else {
    //     if (req.session != undefined && req.session != null) {
    //         // if (req.session.Address === undefined) {
    //         //     req.session.Address = [];
    //             req.session.street = street;
    //             req.session.city = city;
    //             req.session.province = province;
    //             req.session.postalCode = postalCode;
    //             req.session.country = country;
    //         // }
    //     }
    // }
};