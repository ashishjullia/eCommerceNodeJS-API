const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let addressSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    province: {
        type: String,
        required: true
    },
    postalCode: {
        type: String,
        required: true,
        min: 6,
        max: 6
    }
});

module.exports = mongoose.model('Address', addressSchema);