var mongoose = require('../dao/db.js');
var Schema = mongoose.Schema;

var ChatLogSchema = new Schema({
    fromUserId: { type: String },
    toUserId: { type: String },
    contentType: { type: String, default: 'text' },
    content: { type: String },
    status: { type: Number, default: 1 }, // 1：正常状态，2：未读消息
    createDate: { type: Number, default: new Date().getTime() }
});

module.exports.ChatLog = mongoose.model('ChatLog', ChatLogSchema);