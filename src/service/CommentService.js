var commentDao = require('../dao/CommentDao');
var blogDao = require('../dao/BlogDao');

function addComment(objectId, userId, commentInfo) {
    commentInfo.objectId = objectId;
    commentInfo.userId = userId;
    return new Promise((resolve, reject) => {
        var canAddPromise = new Promise((canAddPromiseResolve, canAddPromiseReject) => {
            if (commentInfo.type === 'blog') {
                blogDao.findById(objectId).then(data => {
                    if (data && data.commentAble) {
                        canAddPromiseResolve.resolve();
                    } else {

                    }
                });
            }
        });
        canAddPromise.then();
        // if (commentInfo.type === 'blog') {
        //     canAddPromise = blogDao.findById(objectId);
        //     canAddPromise.then(data => {
        //         if (data && data.commentAble) {
                    
        //         } else {

        //         }
        //     });
        // } else {
        //     commentDao.addComment(commentInfo).then(data => {
        //         resolve(data);
        //     }).catch(data => {
        //         reject({ errorMessage: '数据库异常' });
        //     });
        // }
        
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