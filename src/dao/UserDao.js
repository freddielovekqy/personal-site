var User = require("../model/user.js");

function save (userDTO) {
    var user = new User({
        email: userDTO.email,
        password: userDTO.password
    });
    var promise = user.save();
    promise.then(function (data) {
        return data;
    }).catch(function (error) {
        return error;
    });
}

function findByEmail (email) {
    var promise = User.find({email: email}).exec();
    promise.then(function (data) {
        return data;
    }).catch(function (error) {
        return error;
    });
    return promise;
}

module.exports.save = save;
module.exports.findByEmail = findByEmail;