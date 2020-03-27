const express = require('express');
const router = express.Router();

const confirmBuy_controllers = require('../controllers/confirmBuyController');

router.post('/', confirmBuy_controllers.confirmBuy);

// Export
module.exports = router;