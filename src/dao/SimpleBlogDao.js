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
    return SimpleBlog.update({_id: simpleBlogId}, {$set: updateAttrs});
}

function deleteSimpleBlog(id) {
    return SimpleBlog.update({_id: id}, {$set: {status: 0}});
}

function findSimpleBlogsByUser(userId, status = 1) {
    return SimpleBlog.find({userId: userId, status: status}).lean().exec();
}

module.exports.save = save;
module.exports.updateAttrs = updateAttrs;
module.exports.deleteSimpleBlog = deleteSimpleBlog;
module.exports.findSimpleBlogsByUser = findSimpleBlogsByUser;