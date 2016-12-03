var User = require("../model/user.js");

function insert (userDTO) {
    var user = new User({
        username: userDTO.username,
        password: userDTO.password
    });
    console.log(userDTO, user);
    user.save(function (err, res) {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
        }

    });
}

module.exports.insert = insert;