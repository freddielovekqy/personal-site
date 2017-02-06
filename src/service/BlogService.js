var BlogDao = require('../dao/BlogDao');
var logger = require('../common/log/log4js').logger;


function getBlogsByUser(userId, paginationParams, isCurrentUser) {
    return new Promise(function (resolve, reject) {
        var dataPromise = BlogDao.findByUser(userId, paginationParams, isCurrentUser);
        var countPromise = BlogDao.getBlogCountByCondition({});
        Promise.all([dataPromise, countPromise]).then(function (data) {
            console.log('getBlogsByUser', data);
            var result = {
                blogs: data[0],
                totalCount: data[1]
            }
            resolve(result);
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