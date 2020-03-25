const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Comment', commentSchema);