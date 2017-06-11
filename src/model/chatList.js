var mongoose = require('../dao/db.js');
var Schema = mongoose.Schema;

var ChatListSchema = new Schema({
    userId: { type: String },
    userList: [String]
});

module.exports.ChatList = mongoose.model('ChatList', ChatListSchema);