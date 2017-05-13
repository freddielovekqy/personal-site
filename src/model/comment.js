var moment = require('moment');
var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    userId: { type: String },
    content: { type: String },
    floor: { type: Number }, // 评论的评论的floor是0
    replyFloor: { type: Number, default: 0 },
    replyUserId: { type: String },
    replyUserName: { type: String },
    replyCommentId: { type: String },
    createDate: { type: Date, default: Date.now },
    objectId: { type: String },
    type: { type: String }, // 区分具体是什么东西的评论
    status: { type: Number, default: 1 } // 数据状态：0删除，1正常
});

CommentSchema.virtual('createDateFormatFull').get(function () {
    return moment(this.createDate).format('YYYY-MM-DD hh:mm');
});

CommentSchema.virtual('createDateFormatSimple').get(function () {
    return moment(this.createDate).format('YYYY-MM-DD');
});

module.exports.Comment = mongoose.model('Comment', CommentSchema);