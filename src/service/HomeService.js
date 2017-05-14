var simpleBlogDao = require('../dao/SimpleBlogDao');
var relationshipDao = require('../dao/RelationshipDao');
var commentDao = require('../dao/CommentDao');
var userDao = require('../dao/UserDao');

var simpleBlogService = require('../service/SimpleBlogService')
var logger = require('../common/log/log4js').logger;
var _ = require('lodash');

function findHomeContent(userId) {
    return new Promise((resolve, reject) => {
        var userMap = {};
        var allHomeContent = [];
        relationshipDao.findUserAttentions(userId)
            .then(userAttentions => {
                var getUsersInfoPromise = [];
                var attentionUserIds = [userId];
                userAttentions && userAttentions.attentions && userAttentions.attentions.forEach(attention => {
                    attentionUserIds.push(attention.userId);
                });
                attentionUserIds.forEach(userId => {
                    getUsersInfoPromise.push(userDao.getById(userId));
                });
                return Promise.all(getUsersInfoPromise);
            })
            .then(users => {
                var findUserContentPromises = [];
                users.forEach(user => {
                    user = user.toObject();
                    if (userId === user._id.toString()) {
                        findUserContentPromises.push(simpleBlogDao.findSimpleBlogsByUser(user._id));
                    } else {
                        findUserContentPromises.push(simpleBlogDao.findSimpleBlogsByUser(user._id, {$ne: 3}));
                    }
                });
                userMap = _.keyBy(users, '_id');
                return Promise.all(findUserContentPromises);
            })
            .then(allResults => {
                var countCommentNumPromises = [];
                
                allResults.forEach(contents => {
                    contents.forEach(content => {
                        content.userInfo = userMap[content.userId];
                        allHomeContent.push(content);
                        countCommentNumPromises.push(commentDao.countCommentsByObjectId(content._id));
                    });
                });
                return Promise.all(countCommentNumPromises);
            })
            .then(counts => {
                var findOriginSimpleBlogPromises = [];

                allHomeContent.forEach((content, index) => {
                    content.commentNum = counts[index];
                    if (content.originSimpleBlogId) {
                        findOriginSimpleBlogPromises.push(simpleBlogService.findSimpleBlogWithUserInfo(content.originSimpleBlogId));
                    }
                });
                return Promise.all(findOriginSimpleBlogPromises);
            })
            .then(originSimpleBlogs => {
                allHomeContent.forEach((content, index) => {
                    originSimpleBlogs.forEach(originSimpleBlog => {
                        if (content.originSimpleBlogId === originSimpleBlog._id.toString()) {
                            content.originSimpleBlog = originSimpleBlog;
                        }
                    });
                });
                allHomeContent.sort((pre, next) => {
                    return next.createDate.getTime() - pre.createDate.getTime();
                });
                resolve(allHomeContent);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.findHomeContent = findHomeContent;