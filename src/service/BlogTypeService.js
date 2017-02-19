var BlogTypeDao = require('../dao/BlogTypeDao');
var logger = require('../common/log/log4js').logger;

function save(blogTypeDTO) {
    return new Promise(function (resolve, reject) {
        var promise = BlogTypeDao.save(blogTypeDTO);
        promise.then(function (data) {
            return BlogTypeDao.getByName(blogTypeDTO.name, blogTypeDTO.userId);
        }).then(function (data) {
            if (data.length === 1) {
                resolve(data[0]);
            } else {
                reject({ errorMessage: '数据异常' });
            }
        });
    });
}

function getBlogTypes(userId) {
    return new Promise(function (resolve, reject) {
        console.log('userId', userId);
        var promise = BlogTypeDao.getAllTypeByUser(userId);
        promise.then(function (data) {
            resolve(data);
        }).catch(function (error) {
            console.log('error', error);
        });
    });
}

module.exports.save = save;
module.exports.getBlogTypes = getBlogTypes;