var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var UserBlogInfoSchema = new Schema({
    userId: { type: String },
    level: { typoe: String },
    totalHits: { type: Number },
    integral: { type: Number },// 积分
    ranking: { type: Number },//排名
    originCount: { type: Number, default: 0 },
    rePrintCount: { type: Number, default: 0 },
    translationCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserBlogInfo', UserBlogInfoSchema);