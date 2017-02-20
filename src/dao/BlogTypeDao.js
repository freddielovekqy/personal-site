var BlogType = require("../model/blogType.js");

function save(blogTypeDTO) {
    var blogType = new BlogType({
        name: blogTypeDTO.name,
        userId: blogTypeDTO.userId
    });
    return blogType.save();
}

function update(id, name) {
    return BlogType.update({_id: id}, {$set: {name: name}});
}

function deleteBlogType(id) {
    return BlogType.remove({_id: id});
}

function getByName(type, userId) {
    return BlogType.find({name: type, userId: userId}).exec();
}

function getAllTypeByUser(userId) {
    return BlogType.find({userId: userId}).exec();
}

module.exports.save = save;
module.exports.update = update;
module.exports.deleteBlogType = deleteBlogType;
module.exports.getByName = getByName;
module.exports.getAllTypeByUser = getAllTypeByUser;