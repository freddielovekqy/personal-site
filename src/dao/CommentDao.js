var CommentModule = require("../model/comment.js");
var Comment = CommentModule.Comment;

function addComment(commentInfo) {
    var commentEntity = new Comment({
        userId: commentInfo.userId,
        content: commentInfo.content,
        floor: commentInfo.floor,
        replyFloor: commentInfo.replyFloor,
        replyUserId: commentInfo.replyUserId,
        replyUserName: commentInfo.replyUserName,
        replyCommentId: commentInfo.replyCommentId,
        objectId: commentInfo.objectId,
        type: commentInfo.type
    });
    return commentEntity.save();
}

function deleteComment(commentId) {
    console.log(commentId);
    return Comment.update({_id: commentId}, {$set: {status: 0}});
}

function findCommentsByUser(userId, paginationParams) {
    if (paginationParams) {
        return Comment.find({userId: userId}).skip(paginationParams.startIndex).limit(paginationParams.pageSize).sort({createDate: -1}).exec();
    } else {
        return Comment.find({userId: userId}).sort({createDate: -1}).exec();
    }
}

function findCommentsByBlog(blogId, paginationParams) {
    if (paginationParams) {
        return Comment.find({objectId: blogId, status: 1}).skip(paginationParams.startIndex).limit(paginationParams.pageSize).sort({floor: 1}).exec();
    } else {
        return Comment.find({objectId: blogId, status: 1}).sort({floor: 1}).exec();
    }
}

function countCommentsByObjectId(objectId) {
    return Comment.count({objectId: objectId, status: 1}).exec();
}

function findCommentsByObjectId(objectId) {
    return Comment.find({objectId: objectId, status: 1, replyCommentId: {$exists: false}}).sort({createDate: -1}).lean().exec();
}

function findReplyCommentsByObjectId(objectId) {
    return Comment.find({objectId: objectId, status: 1, replyCommentId: {$exists: true}}).sort({createDate: -1}).lean().exec();
}

module.exports.addComment = addComment;
module.exports.deleteComment = deleteComment;
module.exports.findCommentsByUser = findCommentsByUser;
module.exports.findCommentsByBlog = findCommentsByBlog;
module.exports.findCommentsByObjectId = findCommentsByObjectId;
module.exports.findReplyCommentsByObjectId = findReplyCommentsByObjectId;
module.exports.countCommentsByObjectId = countCommentsByObjectId;