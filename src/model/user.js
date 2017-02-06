var mongoose = require('../dao/db.js'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String },
    email: { type: String },
    password: { type: String },
    head: {type : String}
});

module.exports = mongoose.model('User', UserSchema);