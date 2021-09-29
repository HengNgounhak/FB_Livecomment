const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    urlId: {
        type: String,
        required: true
    },
    commenter_name: {
        type: String,
        required: true
    },
    commenter_url: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    isSelect: {
        type: Boolean,
        require: true
    }
}, { collection: 'comment' });

module.exports = mongoose.model('Comment', userSchema);