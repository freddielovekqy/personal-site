var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var blogCommentSchema = new Schema({
    userId: { type: String },
    content: { type: String },
    floor: { type: Number },
    replyFloor: { type: Number },
    createDate: { type: Date, default: Date.now }
});

var blogReaderSchema = new Schema({
    userId: { type: String },
    readDate: { type: Date, default: Date.now }
});


var BlogSchema = new Schema({
    title: { type: String },
    summary: { type: String },
    keyword: { type: String },
    content: { type: String },
    type: { type: String },
    categories: { type: [String], default: [] },
    status: { type: String, default: '3' }, // 博客状态，1：提交且公开的博客；2：提交但是不公开的博客；3：保存的未提交的博客；4：删除的博客
    commentAble: { type: Boolean, default: true },
    userId: { type: String },
    createDate: { type: Date, default: Date.now },
    lastUpdateDate: { type: Date, default: Date.now },
    topShow: { type: Boolean, default: false },
    comment: [blogCommentSchema],
    reader: [blogReaderSchema],
    readCount: { type: Number, default: 0 }
});


module.exports = mongoose.model('Blog', BlogSchema);