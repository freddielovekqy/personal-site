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
    promise.then(data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.post('/login', (request, response, next) => {
    var email = request.body.email;
    var password = request.body.password;
    logger.info('login', email);
    userService.login(email, password).then(data => {
        request.session.currentUser = data;
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.put('/', (request, response, next) => {
    var userInfo = request.body.userInfo;
    userService.update(userInfo).then(data => {
        request.session.currentUser = data;
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.get('/currentUser', (request, response, next) => {
    var currentUser = request.session.currentUser;
    response.send(JSON.stringify(currentUser));
});

router.get('/:userId', (request, response, next) => {
    var userId = request.params.userId;
    userService.getUserInfo(userId).then(data => {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.put('/password', (request, response, next) => {
    var oldPassword = request.body.oldPassword;
    var newPassword = request.body.newPassword;
    var userId = request.session.currentUser._id;
    userService.updatePassword(userId, oldPassword, newPassword)
        .then(data => {
            response.send(JSON.stringify(data));
        }, error => {
            response.status(400).send(JSON.stringify(error));
        })
        .catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.post('/education', (request, response, next) => {
    var userId = request.body.userId;
    var educationInfo = request.body.educationInfo;

    userService.saveOrUpdateEducation(userId, educationInfo).then(data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.delete('/education', (request, response, next) => {
    var userId = request.query.userId;
    var educationId = request.query.educationId;

    userService.deleteEducation(userId, educationId).then(data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.post('/work', (request, response, next) => {
    var userId = request.body.userId;
    var workInfo = request.body.workInfo;

    userService.saveOrUpdateWork(userId, workInfo).then(data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.delete('/work', (request, response, next) => {
    var userId = request.query.userId;
    var workId = request.query.workId;
    userService.deleteWork(userId, workId).then(data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;
