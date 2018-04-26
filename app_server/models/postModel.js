const config = require('config-lite')(__dirname);
const mongoose = require("mongoose");

mongoose.connect(config.mongodb);

var postSchema = new mongoose.Schema({
    username: String,
    title: String,
    content: String,
    time: { type: Date, default: Date.now },
    postid:{
        type: Number,
        unique: true,
    },
    author:String
})

module.exports = mongoose.model('post', postSchema);
