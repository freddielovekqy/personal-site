var commentDao = require('../dao/CommentDao');
var blogDao = require('../dao/BlogDao');
var simpleBlogDao = require('../dao/SimpleBlogDao');
var userDao = require('../dao/UserDao');
var _ = require('lodash');

function addComment(objectId, userId, commentInfo) {
    return new Promise((resolve, reject) => {
        commentInfo.objectId = objectId;
        commentInfo.userId = userId;

        if (commentInfo.type === 'blog') {
            addBlogComment(objectId, commentInfo)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        } else if (commentInfo.type === 'simpleBlog') {
            addSimpleComment(objectId, commentInfo)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
}

function addSimpleComment(objectId, commentInfo) {
    return new Promise((resolve, reject) => {
        simpleBlogDao.findById(objectId)
            .then(simpleBlog => {
                if (simpleBlog && simpleBlog.commentAble) {
                    return commentDao.addComment(commentInfo);
                } else {
                    reject({ errorMessage: '当前博客不可以评论' });
                }
            })
            .then(data => {
                resolve(data);
            }).catch(data => {
                reject({ errorMessage: '数据库异常' });
            });
    });
}

function addBlogComment(objectId, commentInfo) {
    return new Promise((resolve, reject) => {
        blogDao.findById(objectId)
            .then(blog => {
                if (blog && blog.commentAble) {
                    return commentDao.addComment(commentInfo);
                } else {
                    reject({ errorMessage: '当前博客不可以评论' });
                }
            })
            .then(data => {
                resolve(data);
            }).catch(data => {
                reject({ errorMessage: '数据库异常' });
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

function findAllCommentsBySimpleBlog(simpleBlogId) {
    return new Promise((resolve, reject) => {
        Promise.all([
            findCommentsBySimpleBlog(simpleBlogId),
            findReplyCommentsBySimpleBlog(simpleBlogId)
        ]).then(results => {
            var comments = results[0];
            var replyComments = results[1];

            comments.forEach(comment => {
                comment.replyedComments = [];
                replyComments.forEach(replyComment => {
                    if (replyComment.replyCommentId === comment._id.toString()) {
                        comment.replyedComments.push(replyComment);
                    }
                });
            });
            resolve(comments);
        }).catch(data => {
            reject({ errorMessage: '数据库异常' });
        });
        
    });
}

/**
 * 获取微博的评论（带用户信息）
 */
function findCommentsBySimpleBlog(simpleBlogId) {
    return new Promise((resolve, reject) => {
        commentDao.findCommentsByObjectId(simpleBlogId)
            .then(comments => {
                return findCommentsUserInfo(comments);
            })
            .then(comments => {
                resolve(comments);
            })
            .catch(data => {
                reject({ errorMessage: '数据库异常' });
            });
    });
}

/**
 * 获取微博的评论的评论（带用户信息）
 */
function findReplyCommentsBySimpleBlog(simpleBlogId) {
    return new Promise((resolve, reject) => {
        commentDao.findReplyCommentsByObjectId(simpleBlogId)
            .then(comments => {
                return findCommentsUserInfo(comments);
            })
            .then(comments => {
                resolve(comments);
            })
            .catch(data => {
                reject({ errorMessage: '数据库异常' });
            });
    });
}

function findCommentsUserInfo(comments) {
    return new Promise((resolve, reject) => {
        var commentUserPromises = [];
        comments.forEach(comment => {
            commentUserPromises.push(userDao.getBasicUserInfo(comment.userId));
        });
        Promise.all(commentUserPromises)
            .then(users => {
                comments = comments.map((comment, index) => {
                    comment.userInfo = users[index];
                    return comment;
                });
                resolve(comments);
            })
            .catch(data => {
                reject({ errorMessage: '数据库异常' });
            });
    });
}

module.exports.addComment = addComment;
module.exports.deleteComment = deleteComment;
module.exports.findCommentsByUser = findCommentsByUser;
module.exports.findCommentsByBlog = findCommentsByBlog;
module.exports.findAllCommentsBySimpleBlog = findAllCommentsBySimpleBlog;