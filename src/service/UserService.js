var userDao = require('../dao/UserDao');
var logger = require('../common/log/log4js').logger;

function register(userDTO) {
    return new Promise((resolve, reject) => {
        if (userDTO.password !== userDTO.rePassword) {
            reject({ message: '两次输入的密码不一致' });
        }
        var promise = userDao.findByEmail(userDTO.email);
        promise.then(data => {
            // 根据邮件名查看是否已经有账号
            if (data.length === 0) {
                userDao.save(userDTO);
                resolve(userDTO);
            } else {
                reject({ errorMessage: '该邮箱已经被注册' });
            }
        });
    });

}

function login(email, password) {
    return new Promise((resolve, reject) => {
        var promise = userDao.findByEmail(email);
        promise.then(data => {
            if (!data || data.length === 0) {
                reject({ errorMessage: '用户名不存在' });
            } else {
                var user = data[0];

                if (user.email === email && user.password === password) {
                    resolve(user);
                } else {
                    reject({ errorMessage: '用户名或密码错误' });
                }
            }
        });
    });
}

function updatePassword(userId, oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
        if (oldPassword === newPassword) {
            reject({errorMessage: '输入的新密码和原密码相同'});
        }
        userDao.getPassword(userId)
            .then(user => {
                if (user.password === oldPassword) {
                    return userDao.updateUserAttr(userId, {password: newPassword});
                } else {
                    reject({errorMessage: '输入的原密码有误'});
                }
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}   

function update(userInfo) {
    return new Promise((resolve, reject) => {
        userDao.update(userInfo).then(data => {
            return userDao.getBasicUserInfo(userInfo._id);
        }).then(user => {
            resolve(user);
        }).catch(data => {
            reject({ errorMessage: '数据库异常' });
        });
    });
}

function getUserInfo(userId) {
    return new Promise((resolve, reject) => {
        var promise = userDao.getById(userId);
        promise.then(user => {
            resolve(user);
        });
    });
}

function saveOrUpdateEducation(userId, educationInfo) {
    return new Promise((resolve, reject) => {
        var promise;
        if (educationInfo._id) {
            promise = userDao.updateEducationInfo(userId, educationInfo);
        } else {
            promise = userDao.addEducationInfo(userId, educationInfo);
        }
        promise.then(data => {
            resolve(data);
        }).catch(data => {
            reject({ errorMessage: '数据库异常' });
        });
    });
}

function deleteEducation(userId, educationId) {
    return new Promise((resolve, rejcet) => {
        userDao.deleteEducationInfo(userId, educationId).then(data => {
            resolve(data);
        }).catch(data => {
            rejcet({errorMessage: '数据库异常'});
        });
    });
}

function saveOrUpdateWork(userId, workInfo) {
    return new Promise((resolve, reject) => {
        var promise;
        if (workInfo._id) {
            promise = userDao.updateWorkInfo(userId, workInfo);
        } else {
            promise = userDao.addWorkInfo(userId, workInfo);
        }
        promise.then(data => {
            resolve(data);
        }).catch(data => {
            reject({ errorMessage: '数据库异常' });
        });
    });
}

function deleteWork(userId, workId) {
    return new Promise((resolve, rejcet) => {
        userDao.deleteWorkInfo(userId, workId).then(data => {
            resolve(data);
        }).catch(data => {
            rejcet({errorMessage: '数据库异常'});
        });
    });
}

module.exports.register = register;
module.exports.login = login;
module.exports.getUserInfo = getUserInfo;
module.exports.update = update;
module.exports.updatePassword = updatePassword;
module.exports.saveOrUpdateEducation = saveOrUpdateEducation;
module.exports.deleteEducation = deleteEducation;
module.exports.saveOrUpdateWork = saveOrUpdateWork;
module.exports.deleteWork = deleteWork;