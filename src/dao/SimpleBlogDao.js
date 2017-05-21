var SimpleBlogSchemaModule = require("../model/simpleBlog.js");
var SimpleBlog = SimpleBlogSchemaModule.SimpleBlog;
var Gooder = SimpleBlogSchemaModule.SimpleBlogGooder;

function save(simpleBlogDTO) {
    var simpleBlog = new SimpleBlog({
        content: simpleBlogDTO.content,
        commentAble: simpleBlogDTO.commentAble,
        jurisdiction: simpleBlogDTO.jurisdiction,
        userId: simpleBlogDTO.userId,
        source: simpleBlogDTO.source,
        originSimpleBlogId: simpleBlogDTO.originSimpleBlogId,
    });
    return simpleBlog.save();
}

function updateAttrs(simpleBlogId, updateAttrs) {
    return SimpleBlog.update({ _id: simpleBlogId }, { $set: updateAttrs });
}

function deleteSimpleBlog(id) {
    return SimpleBlog.update({ _id: id }, { $set: { status: 0 } });
}

function findSimpleBlogsByUser(userId, jurisdiction = { $exists: true }, status = 1) {
    return SimpleBlog.find({ userId: userId, jurisdiction: jurisdiction, status: status }).lean().exec();
}

function findRecentSimpleBlogs(startIndex = 0, pageSize = 30) {
    return SimpleBlog
        .find({})
        .skip(startIndex)
        .limit(pageSize)
        .sort({ createDate: 1 })
        .lean()
        .exec();
}

function findById(id) {
    return SimpleBlog.findById(id).lean().exec();
}

module.exports.save = save;
module.exports.updateAttrs = updateAttrs;
module.exports.deleteSimpleBlog = deleteSimpleBlog;
module.exports.findById = findById;
module.exports.findSimpleBlogsByUser = findSimpleBlogsByUser;
module.exports.findRecentSimpleBlogs = findRecentSimpleBlogs;