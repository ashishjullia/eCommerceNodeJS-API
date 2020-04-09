const express = require('express');
const router = express.Router();

const comment_controllers = require('../controllers/commentController');

const { check } = require('express-validator');

router.get('/',
    [
        check('productId').not().isEmpty()
    ]
    , comment_controllers.fetchComments);

router.post('/',
[
    check('productId').not().isEmpty(),
    check('userId').not().isEmpty(),
    check('image').not().isEmpty(),
    check('comment').not().isEmpty(),
    check('stars').not().isEmpty(),
]
, comment_controllers.postComment);
// Export
module.exports = router;