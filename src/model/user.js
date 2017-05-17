var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var HobbySchema = new Schema({
    music: { type: String },
    movie: { type: String },
    sport: { type: String },
    game: { type: String },
    food: { type: String },
    book: { type: String }
});

var EducationInfoSchema = new Schema({
    schoolType: { type: String }, // 学校类型，主要内容为：小学、中学、大学
    schoolName: { type: String },
    inYear: { type: Number }, // 入学时间
    className: { type: String }, // 班级名称
    department: { type: String } // 学院名称
});

var WorkInfoSchema = new Schema({
    company: { type: String },
    department: { type: String },
    startYear: { type: Number },
    endYear: { type: Number },
    location: { type: String }
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
    industry: { type: String }, // 行业
    occupation: { type: String }, // 职业
    briefIntroduction: { type: String }, //简介
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
    hobby: { type: HobbySchema },

    /**
     * 教育信息
     */
    educations: [EducationInfoSchema],

    /**
     * 职业信息
     */
    works: [WorkInfoSchema]
});

module.exports.User = mongoose.model('User', UserSchema);
module.exports.Education = mongoose.model('Education', EducationInfoSchema);
module.exports.Work = mongoose.model('Wrok', WorkInfoSchema);