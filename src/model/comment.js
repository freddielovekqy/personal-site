var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    userId: { type: String },
    content: { type: String },
    floor: { type: Number },
    replyFloor: { type: Number },
    replyUserId: { type: String },
    createDate: { type: Date, default: Date.now },
    objectId: { type: String },
    type: { type: String }, // 区分具体是什么东西的评论
    status: { type: Number } // 数据状态：0删除，1正常
});

module.exports.Comment = mongoose.model('Comment', CommentSchema);