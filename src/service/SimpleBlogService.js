var simpleBlogDao = require('../dao/SimpleBlogDao');
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

module.exports.saveSimpleBlog = saveSimpleBlog;
module.exports.deleteSimpleBlog = deleteSimpleBlog;
module.exports.findSimpleBlogsByUser = findSimpleBlogsByUser;