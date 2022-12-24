const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    state: {
        type: String,
        required: true,
    },
    lga: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLenght: 8
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);
