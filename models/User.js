const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
    id: {type: Number, required: true},
    firstname: {type: String, required: true, max: 100},
    lastname: {type: String, required: true, max: 100},
    email: {type: String, required: true},
    password: {type: String, required: true}
});

// Exporting the model
module.exports = mongoose.model('Users', userSchema);