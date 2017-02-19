var BlogType = require("../model/blogType.js");

function save(blogTypeDTO) {
    var blogType = new BlogType({
        name: blogTypeDTO.name,
        userId: blogTypeDTO.userId
    });
    return blogType.save();
}

function getByName(type, userId) {
    return BlogType.find({name: type, userId: userId}).exec();
}

function getAllTypeByUser(userId) {
    return BlogType.find({userId: userId}).exec();
}

module.exports.save = save;
module.exports.getByName = getByName;
module.exports.getAllTypeByUser = getAllTypeByUser;