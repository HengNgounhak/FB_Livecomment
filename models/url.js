const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    pageId: {
        type: String,
        required: true
    },
    liveurl: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    }
}, { collection: 'url' });

module.exports = mongoose.model('Url', userSchema);