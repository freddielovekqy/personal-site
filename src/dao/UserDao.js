var User = require("../model/user.js");

function save(userDTO) {
    var user = new User({
        email: userDTO.email,
        password: userDTO.password
    });
    return user.save();
}

function findByEmail(email) {
    return User.find({ email: email }).exec();
}

function getById(userId) {
    return User.find({_id: userId}).exec();
}

module.exports.save = save;
module.exports.getById = getById;
module.exports.findByEmail = findByEmail;