var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var SimpleBlogGooderSchema = new Schema({
    userId: { type: String },
    createDate: { type: Date, default: Date.now }
});

var SimpleBlogSchema = new Schema({
    content: { type: String },
    status: { type: Number, default: 1 }, // 0: 删除状态
    jurisdiction: { type: Number, default: 1 }, // 1: 所有人可见， 2: 好友可见，3: 仅自己可见
    commentAble: { type: Boolean, default: true },
    userId: { type: String },
    createDate: { type: Date, default: Date.now },
    source: { type: String }, // 微博的发表来源
    originSimpleBlogId: { type: String }, // 转发的微博的微博ID
    gooders: [SimpleBlogGooderSchema],
});

module.exports.SimpleBlog = mongoose.model('SimpleBlog', SimpleBlogSchema);
module.exports.SimpleBlogGooder = mongoose.model('SimpleBlogGooder', SimpleBlogGooderSchema);