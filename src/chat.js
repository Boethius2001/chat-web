const mongoose = require('mongoose');

const data_schema = new mongoose.Schema({
    username : String,
    text : String
});

const chat_schema = new mongoose.Schema({
    chat_id : String,
    chat_messages : [String]
    //chat_messages : [data_schema]
});

module.exports = mongoose.model('chats', chat_schema);