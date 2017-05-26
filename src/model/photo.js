var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var PhotoSchema = new Schema({
    path: { type: String },
    name: { type: String },
    description: { type: String },
    createDate: {type: Date, default: new Date()}
});

var AlbumSchema = new Schema({
    name: { type: String },
    userId: { type: String },
    status: { type: Number, default: 1 }, // 1: 常态；0: 已删除
    jurisdiction: { type: Number, default: 1 }, // 1: 所有人可见， 2: 好友可见，3: 仅自己可见
    description: { type: String },
    createDate: { type: Date, default: new Date() },
    photos: [PhotoSchema],
    defaultPhotoId: { type: String } // 默认显示的相册的图片
});

// 设置虚拟属性，虚拟属性不会入库，此处不可以用ES6的箭头方法。
// 查询时，photos属性也不能不查
AlbumSchema.virtual('photoCount').get(function () {
    return this.photos.length;
});

module.exports.Photo = mongoose.model('Photo', PhotoSchema);
module.exports.Album = mongoose.model('Album', AlbumSchema);