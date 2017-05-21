var relationshipDao = require('../dao/RelationshipDao');
var userDao = require('../dao/UserDao');
var logger = require('../common/log/log4js').logger;
var _ = require('lodash');

const DEFAULT_ATTENTION_TYPES = ['朋友圈', '特别关注'];

// 注册用户时添加用户的基本关系分组等信息
function initUserRelationship(userId) {
    return new Promise((resolve, reject) => {
        relationshipDao.addRelationship(userId, DEFAULT_ATTENTION_TYPES).then(data => {
            resolve(data);
        });
    });
}

function addAttentionUser(userId, targetUserId, typeName) {
    return new Promise((resolve, reject) => {
        relationshipDao.findAllUserAttentionTypes(userId).then(data => {
            var types = data.types;
            if (types.indexOf(typeName) > -1) {
                return relationshipDao.findUserAttentions(userId);
            } else {
                reject({errorMessage: '当前没有该关注分类'});
            }
        }).then(userAttentionInfo => {
            var attentions = userAttentionInfo.attentions;
            if (_.findIndex(attentions, {userId: targetUserId}) === -1) {
                return relationshipDao.addAttentionUser(userId, targetUserId, typeName);
            } else {
                reject({errorMessage: '您已关注过该用户'});
            }
        }).then(data => {
            resolve(data);
        });
    });
}

function deleteAttention(userId, targetUserId) {
    return new Promise((resolve, reject) => {
        relationshipDao.deleteAttentionUser(userId, targetUserId).then(data => {
            resolve(data);
        });
    });
}

function findFansByUser(userId) {
    return new Promise((resolve, reject) => {
        relationshipDao.findFansByUser(userId).then(users => {
            var findAllUserPromise = [];
            users.forEach(user => {
                findAllUserPromise.push(userDao.getBasicUserInfo(user.userId));
            });
            Promise.all(findAllUserPromise).then(userInfos => {
                resolve(userInfos);
            });
        });
    });
}

function findUserAttentions(userId, username) {
    return new Promise((resolve, reject) => {
        relationshipDao.findUserAttentions(userId)
            .then(data => {
                var findAllUserPromise = [];
                data.attentions.forEach(attention => {
                    findAllUserPromise.push(assignUserInfoToAttention(attention));
                });
                return Promise.all(findAllUserPromise);
            })
            .then(userInfos => {
                if (username) {
                    userInfos = userInfos.filter(userInfo => {
                        return userInfo.username.indexOf(username) > -1;
                    });
                }
                resolve(userInfos);
            });
    });
}

/**
 * 补全attention中的用户信息
 * @param attention
 */
function assignUserInfoToAttention(attention) {
    return new Promise((resolve, reject) => {
        userDao.getBasicUserInfo(attention.userId)
            .then(user => {
                attention = Object.assign(attention, user.toObject());
                resolve(attention);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findAllUserAttentionTypes(userId) {
    return new Promise((resolve, reject) => {
        relationshipDao.findAllUserAttentionTypes(userId).then(data => {
            resolve(data);
        });
    });
}

function countAttentionsGroupByType(userId) {
    return new Promise((resolve, reject) => {
        var typeGroupCount = {
            total: 0,
            typeGroupCount: []
        };
        var groupTypeAttentionPromises = [];
        relationshipDao.findAllUserAttentionTypes(userId)
            .then(userAttentionsInfo => {
                userAttentionsInfo.types.push('');
                userAttentionsInfo && userAttentionsInfo.types.forEach(type => {
                    groupTypeAttentionPromises.push(countAttentionsByType(userId, type));
                });
                return Promise.all(groupTypeAttentionPromises);
            })
            .then(data => {
                data.forEach(item => {
                    typeGroupCount.typeGroupCount.push(item);
                });
                return relationshipDao.findUserAttentions(userId);
            }).then(data => {
                typeGroupCount.total = data.attentions.length;
                resolve(typeGroupCount);
            });
    });
}

/**
 * 根据关注类型获取该类型下的关注的用户的个数
 * @param {String} userId 查询的用户ID
 * @param {String} type 关注的类型
 */
function countAttentionsByType(userId, type) {
    return new Promise((resolve, reject) => {
        relationshipDao.findAttentionsByType(userId, type).then(data => {
            var attentionCount = {
                typeName: type
            };
            if (data && data.attentions) {
                attentionCount.count = data.attentions.length;
            } else {
                attentionCount.count = 0;
            }
            resolve(attentionCount);
        });
    });
}

module.exports.initUserRelationship = initUserRelationship;
module.exports.addAttentionUser = addAttentionUser;
module.exports.deleteAttention = deleteAttention;
module.exports.findFansByUser = findFansByUser;
module.exports.findUserAttentions = findUserAttentions;
module.exports.findAllUserAttentionTypes = findAllUserAttentionTypes;
module.exports.countAttentionsGroupByType = countAttentionsGroupByType;