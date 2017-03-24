var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: { type: String },
    username: { type: String },
    realName: { type: String },
    password: { type: String },
    headImgPath: { type: String },
    country: { type: String },
    birthday: { type: Date },
    birthPlace: {type: String}, 
    sex: { type: String },
    industry: { type: String },
    occupation: { type: String },
    briefIntroduction: { type: String },
    createDate: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);