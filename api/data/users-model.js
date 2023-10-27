const mongoose = require('mongoose');
require("dotenv").config();
const usersSchema = mongoose.Schema({
    name: String,
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const Users = mongoose.model(process.env.USER_MODEL, usersSchema)

module.exports = { Users };