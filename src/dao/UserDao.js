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

function update(userDTO) {
    var userId = userDTO._id;
    return getById(userId).then(user => {
        user = Object.assign(user, userDTO);
        delete user._id;
        return User.update({'_id': userId}, user);
    });
}

function getById(userId) {
    return User.findById({_id: userId}).exec();
}

module.exports.save = save;
module.exports.update = update;
module.exports.getById = getById;
module.exports.findByEmail = findByEmail;