var commentDao = require('../dao/CommentDao');
var blogDao = require('../dao/BlogDao');

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

module.exports.addComment = addComment;
module.exports.deleteComment = deleteComment;
module.exports.findCommentsByUser = findCommentsByUser;