var BlogDao = require('../dao/BlogDao');
var logger = require('../common/log/log4js').logger;


function getBlogsByUser(userId, isCurrentUser) {
    return new Promise(function (resolve, reject) {
        var promise = BlogDao.findByUser(userId, isCurrentUser);
        promise.then(function (data) {
            console.log('getBlogsByUser', data);
            resolve(data);
        });
    });
}

function saveBlog(blogDTO) {
    return new Promise(function (resolve, reject) {
        logger.info('saveBlog', blogDTO);
        var promise = BlogDao.save(blogDTO);
        promise.then(function (data) {
            resolve(data);
        });
    });
}

module.exports.getBlogsByUser = getBlogsByUser;
module.exports.saveBlog = saveBlog;