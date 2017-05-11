var simpleBlogDao = require('../dao/SimpleBlogDao');
var relationshipDao = require('../dao/RelationshipDao');
var userDao = require('../dao/UserDao');
var logger = require('../common/log/log4js').logger;
var _ = require('lodash');

function findHomeContent(userId) {
    return new Promise((resolve, reject) => {
        var userMap = {};
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
                    findUserContentPromises.push(simpleBlogDao.findSimpleBlogsByUser(user._id));
                });
                userMap = _.keyBy(users, '_id');
                return Promise.all(findUserContentPromises);
            })
            .then(allContent => {
                var allHomeContent = [];
                allContent.forEach(contents => {
                    contents.forEach(content => {
                        content.userInfo = userMap[content.userId];
                        allHomeContent.push(content);
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