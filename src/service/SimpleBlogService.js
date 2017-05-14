var simpleBlogDao = require('../dao/SimpleBlogDao');
var userDao = require('../dao/UserDao');
var logger = require('../common/log/log4js').logger;

function saveSimpleBlog(userId, simpleBlog) {
    return new Promise((resolve, reject) => {
        simpleBlog.userId = userId;
        simpleBlogDao.save(simpleBlog)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function updateSimpleBlogJurisdiction(simpleBlogId, jurisdiction) {
    return new Promise((resolve, reject) => {
        var updateAttrs = {
            jurisdiction: jurisdiction
        };
        simpleBlogDao.updateAttrs(simpleBlogId, updateAttrs)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function deleteSimpleBlog(simpleBlogId) {
    return new Promise((resolve, reject) => {
        simpleBlogDao.deleteSimpleBlog(simpleBlogId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findSimpleBlogsByUser(userId) {
    return new Promise((resolve, reject) => {
        simpleBlogDao.findSimpleBlogsByUser(userId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findSimpleBlogWithUserInfo(id) {
    return new Promise((resolve, reject) => {
        var result = {};
        simpleBlogDao.findById(id)
            .then(simpleBlog => {
                result = simpleBlog;
                return userDao.getBasicUserInfo(simpleBlog.userId);
            })
            .then(userInfo => {
                result.userInfo = userInfo;
                resolve(result);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.saveSimpleBlog = saveSimpleBlog;
module.exports.updateSimpleBlogJurisdiction = updateSimpleBlogJurisdiction;
module.exports.deleteSimpleBlog = deleteSimpleBlog;
module.exports.findSimpleBlogsByUser = findSimpleBlogsByUser;
module.exports.findSimpleBlogWithUserInfo = findSimpleBlogWithUserInfo;