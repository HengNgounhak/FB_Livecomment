const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fbId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    telephone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { collection: 'user' });

module.exports = mongoose.model('User', userSchema);