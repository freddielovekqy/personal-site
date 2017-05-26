var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var BlogReaderSchema = new Schema({
    userId: { type: String },
    readDate: { type: Date, default: Date.now }
});

var GooderSchema = new Schema({
    userId: { type: String },
    createDate: { type: Date, default: Date.now }
});


var BlogSchema = new Schema({
    title: { type: String },
    summary: { type: String },
    keyword: { type: String },
    content: { type: String },
    type: { type: String }, // 主要内容是1. '原创', 2. '转载', 3. '翻译'
    categories: { type: [String], default: [] },
    status: { type: String, default: '3' }, // 博客状态，1：提交且公开的博客；2：提交但是不公开的博客；3：保存的未提交的博客；4：删除的博客
    commentAble: { type: Boolean, default: true },
    userId: { type: String },
    createDate: { type: Date, default: Date.now },
    lastUpdateDate: { type: Date, default: Date.now },
    topShow: { type: Boolean, default: false },
    readers: [BlogReaderSchema],
    hitCount: { type: Number, default: 0 },
    source: { type: String },
    originBlogId: { type: String },
    gooders: [GooderSchema],
});

// 设置虚拟属性，虚拟属性不会入库
BlogSchema.virtual('readCount').get(() => {
    return this.readers.length;
});


module.exports.Blog = mongoose.model('Blog', BlogSchema);
module.exports.BlogReader = mongoose.model('BlogReader', BlogReaderSchema);
module.exports.Gooder = mongoose.model('Gooder', GooderSchema);