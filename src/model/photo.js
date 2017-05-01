var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    path: { type: String },
    name: { type: String },
    description: { tyle: String }
});

var AlbumSchema = new Schema({
    name: { type: String },
    userId: { type: String },
    status: { type: Number , default: 1}, // 1: 常态；0: 已删除；2：私密相册,
    description: { tyle: String },
    createDate: { type: Date, default: new Date() },
    phtots: [PhotoSchema],
    defaultPhoto: {PhotoSchema} // 默认显示的相册的图片
});

module.exports.Photo = mongoose.model('Photo', PhotoSchema);
module.exports.Album = mongoose.model('Album', AlbumSchema);