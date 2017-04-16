var relationshipDao = require('../dao/RelationshipDao');
var logger = require('../common/log/log4js').logger;
var _ = require('lodash');

// 注册用户时添加用户的基本关系分组等信息
function initUserRelationship(userId) {
    var defaultAttentionTypes = ['特别关注'];
    return new Promise((resolve, reject) => {
        relationshipDao.addRelationship(userId, defaultAttentionTypes).then(data => {
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

function findUserAttentions(userId) {
    return new Promise((resolve, reject) => {
        relationshipDao.findUserAttentions(userId).then(data => {
            resolve(data);
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

module.exports.initUserRelationship = initUserRelationship;
module.exports.addAttentionUser = addAttentionUser;
module.exports.deleteAttention = deleteAttention;
module.exports.findUserAttentions = findUserAttentions;
module.exports.findAllUserAttentionTypes = findAllUserAttentionTypes;