const express = require('express');
const router = express.Router();


// Import the "User" model
const users_controllers = require('../controllers/userController');

// CREATE a user
router.post('/signup', users_controllers.signUp);

// USER login
router.post('/login', users_controllers.logIn);

// GET a specific user
router.get('/:userId', users_controllers.getSpecificUser);

// DELETE Or REMOVE a specific user
router.delete('/:userId', users_controllers.removeSpecificUser);

// UPDATE Or MODIFY a specific user's data
//router.patch('/:userId', users_controllers.updateSpecificUSer);

// Export
module.exports = router;