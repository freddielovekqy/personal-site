var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var hobbySchema = new Schema({
    music: { type: String },
    movie: { type: String },
    sport: { type: String },
    game: { type: String },
    food: { type: String },
    book: { type: String }
});

var UserSchema = new Schema({
    email: { type: String },
    username: { type: String },
    realName: { type: String },
    password: { type: String },
    headImgPath: { type: String },
    country: { type: String },
    birthday: { type: Date },
    birthPlace: { type: String },
    sex: { type: String },
    industry: { type: String },
    occupation: { type: String },
    briefIntroduction: { type: String },
    createDate: { type: Date },

    /**
     * 个人详细信息
     */
    relationshipStatus: { type: String },
    livePlace: { type: String },
    blood: { type: String },
    constellation: { type: String }, // 星座
    phoneNumber: { type: String },
    otherEmail: { type: String },
    QQ: { type: String },
    personalWebsite: { type: String },

    /**
     * 兴趣爱好
     */
    hobby: { type: hobbySchema }
});

module.exports = mongoose.model('User', UserSchema);