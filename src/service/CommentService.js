var commentDao = require('../dao/CommentDao');
var blogDao = require('../dao/BlogDao');
var userDao = require('../dao/UserDao');
var _ = require('lodash');

function addComment(objectId, userId, commentInfo) {
    return new Promise((resolve, reject) => {
        commentInfo.objectId = objectId;
        commentInfo.userId = userId;
        new Promise((canAddPromiseResolve, canAddPromiseReject) => {
            if (commentInfo.type === 'blog') {
                blogDao.findById(objectId).then(data => {
                    console.log(data);
                    if (data && data.commentAble) {
                        canAddPromiseResolve();
                    } else {
                        canAddPromiseReject({ errorMessage: '当前博客不可以评论' });
                    }
                });
            }
        }).then(data => {
            console.log("comment", commentInfo);
            commentDao.addComment(commentInfo).then(data => {
                resolve(data);
            }).catch(data => {
                reject({ errorMessage: '数据库异常' });
            });
        }, data => {
            reject(data);
        });
    });
}

function deleteComment(commentId) {
    return new Promise((resolve, reject) => {
        var promise = commentDao.deleteComment(commentId);
        promise.then(data => {
            resolve(data);
        }).catch(data => {
            reject({ errorMessage: '数据库异常' });
        });
    });
}

function findCommentsByUser(userId) {
    return new Promise((resolve, reject) => {
        var promise = commentDao.findCommentsByUser(userId);
        promise.then(data => {
            resolve(data);
        }).catch(data => {
            reject({ errorMessage: '数据库异常' });
        });
    });
}

function findCommentsByBlog(blogId) {
    return new Promise((resolve, reject) => {
        var promise = commentDao.findCommentsByBlog(blogId);
        promise.then(comments => {
            if (comments && comments.length > 0) {
                var findAllUserPromises = [];
                comments.forEach(comment => {
                    findAllUserPromises.push(userDao.getById(comment.userId));
                });
                Promise.all(findAllUserPromises).then(data => {
                    comments = comments.map((comment, index) => {
                        comment = comment.toObject();
                        comment.userInfo = data[index];
                        var replyUserIndex = _.findIndex(data, {_id: comment.replyUserId});
                        console.log(data, replyUserIndex);
                        replyUserIndex > -1 && (comment.replyUserName = data[replyUserIndex].username);
                        return comment;
                    });
                    resolve(comments);
                });
            } else {
                resolve(comments);
            }
        });
    });
}

module.exports.addComment = addComment;
module.exports.deleteComment = deleteComment;
module.exports.findCommentsByUser = findCommentsByUser;
module.exports.findCommentsByBlog = findCommentsByBlog;