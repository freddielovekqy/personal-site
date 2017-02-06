var userBlogInfoDao = require('../dao/UserBlogInfoDao');
var logger = require('../common/log/log4js').logger;

function getUserBlogInfo(userId) {
    return new Promise(function (resolve, reject) {
        var promise = userBlogInfoDao.findByUser(userId);
        promise.then(function (data) {
            console.log('findUserBlogInfo', data);
            if (data.length === 1) {
                resolve(data[0]);
            } else {
                reject({errorMessage: '系统内容异常'});
            }
            
        });
    });
}

module.exports.getUserBlogInfo = getUserBlogInfo;