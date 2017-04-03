var userBlogInfoDao = require('../dao/UserBlogInfoDao');
var blogDao = require('../dao/BlogDao');
var userDao = require('../dao/UserDao');
var logger = require('../common/log/log4js').logger;

function getUserBlogInfo(userId) {
    return new Promise((resolve, reject) => {
        var promise = userBlogInfoDao.findByUser(userId);
        var commonUserInfoPromise = userDao.getById(userId);
        Promise.all([promise, commonUserInfoPromise]).then(data => {
            var basicUserInfo = data[1];
            delete basicUserInfo.password;
            resolve({
                userInfo: basicUserInfo,
                userBlogInfo: data[0]
            });
        }).catch(error => {
            logger.error('获取的用户博客信息异常', error);
            reject({errorMessage: '系统内容异常'});
        });
    });
}

function saveUserBlogInfo(userBlogInfoDTO) {
    return new Promise((resolve, reject) => {
        var promise = userBlogInfoDao.save(userBlogInfoDTO);
        promise.then(function (data) {
            resolve(data);
        }).catch(error => {
            logger.error('保存用户博客信息异常', error);
            reject({errorMessage: '系统内容异常'});
        });
    });
}

module.exports.getUserBlogInfo = getUserBlogInfo;
module.exports.saveUserBlogInfo = saveUserBlogInfo;