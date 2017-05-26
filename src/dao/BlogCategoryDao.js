var BlogCategory = require("../model/blogCategory.js");

function save(blogCategoryDTO) {
    var blogCategory = new BlogCategory({
        name: blogCategoryDTO.name,
        userId: blogCategoryDTO.userId
    });
    return blogCategory.save();
}

function update(id, name) {
    return BlogCategory.update({_id: id}, {$set: {name: name}});
}

function deleteBlogCategory(id) {
    return BlogCategory.remove({_id: id});
}

function getByName(category, userId) {
    return BlogCategory.find({name: category, userId: userId}).exec();
}

function getAllCategoryByUser(userId) {
    return BlogCategory.find({userId: userId}).exec();
}

module.exports.save = save;
module.exports.update = update;
module.exports.deleteBlogCategory = deleteBlogCategory;
module.exports.getByName = getByName;
module.exports.getAllCategoryByUser = getAllCategoryByUser;