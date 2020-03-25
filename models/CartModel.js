const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let cartSchema = new Schema({
    productId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Cart', cartSchema);