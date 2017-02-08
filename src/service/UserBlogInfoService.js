var userBlogInfoDao = require('../dao/UserBlogInfoDao');
var blogDao = require('../dao/BlogDao');
var logger = require('../common/log/log4js').logger;

function getUserBlogInfo(userId) {
    return new Promise(function (resolve, reject) {
        var promise = userBlogInfoDao.findByUser(userId);
        promise.then(function (data) {
            console.log('findUserBlogInfo', data);
            if (data.length === 1) {
                resolve(data[0]);
            } else {
                logger.error('获取的用户博客信息数量不对', data);
                reject({errorMessage: '数据异常'});
            }
        }).catch(function (error) {
            logger.error('获取的用户博客信息异常', error);
            reject({errorMessage: '系统内容异常'});
        });
    });
}

function saveUserBlogInfo(userBlogInfoDTO) {
    return new Promise(function (resolve, reject) {
        var promise = userBlogInfoDao.save(userBlogInfoDTO);
        promise.then(function (data) {
            resolve(data);
        }).catch(function (error) {
            logger.error('保存用户博客信息异常', error);
            reject({errorMessage: '系统内容异常'});
        });
    });
}

module.exports.getUserBlogInfo = getUserBlogInfo;
module.exports.saveUserBlogInfo = saveUserBlogInfo;