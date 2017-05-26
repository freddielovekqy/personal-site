var BlogCategoryDao = require('../dao/BlogCategoryDao');
var logger = require('../common/log/log4js').logger;

function save(blogCategoryDTO) {
    return new Promise(function (resolve, reject) {
        var promise = BlogCategoryDao.save(blogCategoryDTO);
        promise.then(function (data) {
            return BlogCategoryDao.getByName(blogCategoryDTO.name, blogCategoryDTO.userId);
        }).then(function (data) {
            if (data.length === 1) {
                resolve(data[0]);
            } else {
                reject({ errorMessage: '数据异常' });
            }
        });
    });
}

function update(id, name) {
    return new Promise(function (resolve, reject) {
        var promise = BlogCategoryDao.update(id, name);
        promise.then(function (data) {
            resolve(data);
        }).catch(function (error) {
            reject(error);
        });
    });
}

function deleteBlogCategory(id) {
    return new Promise(function (resolve, reject) {
        var promise = BlogCategoryDao.deleteBlogCategory(id);
        promise.then(function (data) {
            resolve(data);
        }).catch(function (error) {
            reject(error);
        });
    });
}

function getBlogCategorys(userId) {
    return new Promise(function (resolve, reject) {
        console.log('userId', userId);
        var promise = BlogCategoryDao.getAllCategoryByUser(userId);
        promise.then(function (data) {
            resolve(data);
        }).catch(function (error) {
            console.log('error', error);
        });
    });
}



module.exports.save = save;
module.exports.update = update;
module.exports.deleteBlogCategory = deleteBlogCategory;
module.exports.getBlogCategorys = getBlogCategorys;