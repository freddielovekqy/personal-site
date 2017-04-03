var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var userService = require('../service/UserService');

router.post('/register', function (request, response, next) {
    var userDTO = {
        email: request.body.email,
        password: request.body.password,
        rePassword: request.body.rePassword
    };
    logger.info('register', userDTO);
    
    var promise = userService.register(userDTO);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/login', function (request, response, next) {
    var email = request.body.email;
    var password = request.body.password;
    logger.info('login', email);
    var promise = userService.login(email, password);
    promise.then(function (data) {
        request.session.currentUser = {
            id: data._id
        };
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/update', function (request, response, next) {
    var userInfo = request.body.userInfo;
    var promise = userService.update(userInfo);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.get('/getUserInfo/:userId', function (request, response, next) {
    var userId = request.params.userId;
    var promise = userService.getUserInfo(userId);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;
