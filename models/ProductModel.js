const mongoose = require('mongoose');


const Schema = mongoose.Schema;

let productSchema = new Schema({
    __id: Schema.Types.ObjectId,
    title: {type: String, required: true, max: 100},
    description: {type: String, required: true, max: 100},
    image: {type: String, require: true},
    pricing: {type: Number, required: true},
    shipping: {type: Number, required: true}, 
    quantity: {type: Number, required: true}
});

// Exporting the model
module.exports = mongoose.model('Products', productSchema);