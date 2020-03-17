const express = require('express');
const router = express.Router();

// Import the "User" model
const Product = require('../models/User');


// GET all Users
router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find();
        res.json(allUsers);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// POST a user
router.post('/', async (req, res) => {
    
    // creating a new user from the data being sent via a post request
    const user = new User({
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password
    });

    // save the data to the User model/collection
    try {
        const savedUser =  await user.save();
        res.json(savedUser);
        res.json("User has been added/created.");
    } catch (err) {
        res.json({
            message: err
        });
    }
    console.log("User has been added/created.");
});

// GET a specific user
router.get('/:userId', async(req, res) => {
    try {
        const getSpecificUser = await User.findById(req.params.userId);
        res.json(getSpecificUser);
    } catch (err) {
        res.json({message: err});
    }
});

// DELETE Or REMOVE a specific user
router.delete('/:userId', async(req, res) => {
    try {
        const removeSpecificUser = await User.remove({
            id: req.params.userId
        });
        res.json(removeSpecificUser);
    } catch (err) {
        res.json({message: err});
    }
});

// UPDATE Or MODIFY a specific user's data
router.patch('/:userId', async(req, res) => {
    try {
    const updateSpecificUser = await User.updateOne(
        {id: req.params.userId},
        {$set: {
            id: req.body.id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password
        }
    });
    res.json(updateSpecificUser);
    } catch (err) {
        res.json({message: err});
    }
});

// Export
module.exports = router;