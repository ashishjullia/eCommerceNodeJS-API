const User = require('../models/UserModel');

const HttpError = require('../models/HttpErrorModel');

const bcrypt = require('bcryptjs');

const { validationResult } = require('express-validator');

const jsonwebtoken = require('jsonwebtoken');

// CREATE a user
exports.signUp = async (req, res, next) => {
    // Validating the data before creating a user
    const errors = validationResult(req);
    if (!errors.isEmpty) {
        return next(
            new HttpError('Invalid inputs, please provide correct data!', 422)
        );
    }

    const { id, firstname, lastname, email, password } = req.body;

    // Check whether user is already registered or not
    let userExists;
    try {
        userExists = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Sign up failed!', 500);
        // important to return from here.
        return next(error);         
    }

    if (userExists) {
        const error = new HttpError('User already registered with this email, try logging in instead!', 422);
        return next(error);
    }

    // Crypt the password before saving it
    let cryptPassword;
    // 10 = salting rounds
    // The has will now return a "promise"
    try {
        cryptPassword = await bcrypt.hash(password, 10);
    } catch (err) {
        const error = new HttpError('Could not create user, at this time, try again later!', 500);
        return next(error);
    } 

    // creating a new user from the data being sent via a post request
    const newUser = new User({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: cryptPassword,
    });
    
    // save the data to the User model/collection
    try {
        const savedUser =  await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.json({
            message: err
        });
    }

    // Generate a token
    let token;
    try {
        token = jsonwebtoken.sign(
            {userId: newUser.id}, 
            'secret', 
            {expiresIn: '1h'});
    } catch (err) {
        const error = new HttpError('Could not create user, at this time, try again later!', 500);
        return next(error);
    } 

    res.status(201).json({
        userId: newUser.id,
        email: newUser.email,
        token: token
    });
};

// USER login
exports.logIn = async (req, res, next) => {
    // Validating the data before anything else
    const errors = validationResult(req);
    
    if (!errors.isEmpty) {
        return next(
            new HttpError('Invalid inputs, please provide correct data!', 422)
        );
    }

    const { email, password } = req.body;

    // Step 1: grab the email/user from the database
    // Check whether user is already registered or not
    let userExists;
    try {
        userExists = await User.findOne({ email: email });
    } catch (err) {
        const error = new HttpError('Logging in failed, try again later!', 500);
        // important to return from here.
        return next(error);         
    }
    
    // Step 2: compare its email and password with the passed/fetched
    if (!userExists) {
        const error = new HttpError('Invalid Credentials, logging in failed!', 401);
        return next(error);
    }
    
    let validPassword = false;
    try {
        validPassword = await bcrypt.compare(password, userExists.password);
    } catch (err) {
        const error = new HttpError('Cannot log in, please check credentials!', 500);
        return next(error);
    }
    
    if (!validPassword) {
        const error = new HttpError('Invalid Credentials, logging in failed!', 401);
        return next(error);
    }

    // if all the upper validations are valid, only then we'll generate and give token to this user
    // Generate toke, make sure to use the same "secret" used above in "signup"
    let token;
    try {
        session = req.session;
        token = jsonwebtoken.sign(
            {userId: userExists.id}, 
            'secret', 
            {expiresIn: '1h'});
    } catch (err) {
        const error = err;
        return next(error);
    } 
    
    res.json({
        userId: userExists.id,
        email: userExists.email,
        token: token,
        message: "Logged in",
    });
};

// USER LogOut
exports.logOut = async (req, res, next) => {
    try {
        req.session.destroy();
    } catch (err) {
        const error = new HttpError ('Unable to destroy session.', 422);
        return next(error);
    }
    res.json({ message: "logout" });
}

// GET all Users
exports.getAllUsers = async (req, res, next) => {
    let allUsers;
    try {
        allUsers = await User.find();
        if (!allUsers.isEmpty) {
            res.json({ "users": allUsers });
        }
    } catch (err) {
        // res.json({ message: "No user found json" }); => return in "json"
        const error = new HttpError('No users found!', 500);
        return next(error);
    }
};

// GET a specific user
exports.getSpecificUser = async (req, res, next) => {
    try {
        const getSpecificUser = await User.findById(req.params.userId);
        res.json(getSpecificUser);
    } catch (err) {
        const error = new HttpError('Sorry! No users found! Try creating one.', 500);
        return next(error);
    }
};

// DELETE Or REMOVE a specific user
exports.removeSpecificUser = async (req, res) => {
    try {
        const removeSpecificUser = await User.remove({
            _id: req.params.userId
        });
        res.json(removeSpecificUser);
    } catch (err) {
        res.json(err);
    }
};