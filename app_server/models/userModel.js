const config = require('config-lite')(__dirname);
const mongoose = require("mongoose");

mongoose.connect(config.mongodb);

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String
})

module.exports = mongoose.model('user', userSchema);
