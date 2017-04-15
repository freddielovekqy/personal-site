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
                    findAllUserPromises.push(new Promise((getUserResolve, getUserReject) => {
                        userDao.getById(comment.userId).then(user => {
                            var userInfo = user.toObject();
                            userInfo._id = userInfo._id.toString();
                            delete userInfo.hobby;
                            delete userInfo.works;
                            delete userInfo.educations;
                            getUserResolve(userInfo);
                        });
                    }));
                });
                Promise.all(findAllUserPromises).then(data => {
                    comments = comments.map((comment, index) => {
                        comment = comment.toObject();
                        comment.replyComments = comments.filter(com => {
                            return com.replyFloor === comment.floor;
                        });
                        var replyUserIndex = _.findIndex(data, {_id: comment.replyUserId});
                        replyUserIndex > -1 && (comment.replyUserName = data[replyUserIndex].username);
                        comment.userInfo = data[index];
                        return comment;
                    });
                    comments = comments.map(comment => {
                        comment.replyComments = comments.filter(com => {
                            return com.replyFloor === comment.floor && !comment.replyUserId;
                        });
                        return comment;
                    });
                    comments = comments.filter(comment => {
                        return !comment.replyUserId;
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