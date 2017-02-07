var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var UserBlogInfoSchema = new Schema({
    userId: { type: String },
    level: { typoe: String },
    totalHits: { type: Number },
    integral: { type: Number },// 积分
    ranking: { type: Number }//排名
});

module.exports = mongoose.model('UserBlogInfo', UserBlogInfoSchema);