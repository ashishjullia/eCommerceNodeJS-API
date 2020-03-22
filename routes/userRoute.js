const express = require('express');
const router = express.Router();


// Import the "User" model
const users_controllers = require('../controllers/userController');

// CREATE a user
router.post('/signup',
    [
        check('firstname').not().isEmpty(),
        check('lastname').not().isEmpty(),
        check('email').not().isEmpty().isEmail().normalizeEmail(),
        check('password').not().isEmpty()
    ],    
    users_controllers.signUp);

// USER login
router.post('/login', 
    [
        check('email').not().isEmpty().isEmail().normalizeEmail(),
        check('password').not().isEmpty()
    ],
    users_controllers.logIn);

// GET a specific user
router.get('/:userId', users_controllers.getSpecificUser);

// DELETE Or REMOVE a specific user
router.delete('/:userId', users_controllers.removeSpecificUser);

// UPDATE Or MODIFY a specific user's data
//router.patch('/:userId', users_controllers.updateSpecificUSer);

// Export 
module.exports = router;