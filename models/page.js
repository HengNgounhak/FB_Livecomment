const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    fbId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { collection: 'page' });

module.exports = mongoose.model('Page', userSchema);