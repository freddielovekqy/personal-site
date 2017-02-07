var userDao = require('../dao/UserDao');
var logger = require('../common/log/log4js').logger;

function register(userDTO) {
    return new Promise(function (resolve, reject) {
        if (userDTO.password !== userDTO.rePassword) {
            reject({ message: '两次输入的密码不一致' });
        }
        var promise = userDao.findByEmail(userDTO.email);
        promise.then(function (data) {
            console.log('findByEmail', data);
            // 根据邮件名查看是否已经有账号
            if (data.length === 0) {
                userDao.save(userDTO);
                console.log(userDTO);
                resolve(userDTO);
            } else {
                reject({ errorMessage: '该邮箱已经被注册' });
            }
        });
    });

}

function login(email, password) 　{
    return new Promise(function (resolve, reject) {
        var promise = userDao.findByEmail(email);
        promise.then(function (data) {
            if (!data || data.length === 0) {
                reject({ errorMessage: '用户名不存在' });
            } else {
                var user = data[0];
                console.log('findByEmail', user);

                if (user.email === email && user.password === password) {
                    resolve(user);
                } else {
                    reject({ errorMessage: '用户名或密码错误' });
                }
            }
        });
    });
}

function getUserInfo(userId) {
    return new Promise(function (resolve, reject) {
        var promise = userDao.getById(userId);
        promise.then(function (data) {
            if (data.length === 1) {
                var user = data[0];
                delete user['password'];
                resolve(user);
            } else {
                reject({ errorMessage: '数据异常' });
            }
        });
    });
}

module.exports.register = register;
module.exports.login = login;
module.exports.getUserInfo = getUserInfo;