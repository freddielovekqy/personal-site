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
    isPublic: {type: Boolean, default: true},
    userId: { type: String },
    createDate: { type: Date, default: Date.now },
    lastUpdateDate: { type: Date, default: Date.now },
    comment: [blogCommentSchema],
    reader: [blogReaderSchema]
});


module.exports = mongoose.model('Blog', BlogSchema);