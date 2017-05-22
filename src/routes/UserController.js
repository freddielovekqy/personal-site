var express = require('express');
var formidable = require('formidable');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var userService = require('../service/UserService');

router.post('/', function (request, response, next) {
    var userDTO = request.body.user;
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

    userService.login(email, password)
        .then(data => {
            request.session.currentUser = data;
            response.send(JSON.stringify(data));
        }).catch(data => {
            response.send(JSON.stringify(data));
        });
});

router.post('/logout', (request, response, next) => {
    delete request.session.currentUser;
    response.send(JSON.stringify({result: 'success'}));
});

router.put('/userImage', (request, response, next) => {
    var form = new formidable.IncomingForm({
        encoding: 'utf-8',
        uploadDir: 'webapp/image/users',  //文件上传地址
        keepExtensions: true,  //保留后缀
        maxFieldsSize: 2 * 1024 * 1024 //设置单文件大小限制
    });

    form.parse(request, function (err, fields, files) {
        if (!err) {
            var file = files.file;
            var fileName = file.path.split('\\')[file.path.split('\\').length - 1];
            var path = `image/users/${fileName}`;
            userService.setUserImage(request.session.currentUser._id, path)
                .then(data => {
                    response.send(JSON.stringify(data));
                }).catch(function (data) {
                    response.send(JSON.stringify(data));
                });
        } else {
            response.send(JSON.stringify(err));
        }
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
    response.send(JSON.stringify(request.session.currentUser));
});

router.get('/:userId', (request, response, next) => {
    var userId = request.params.userId;
    userService.getUserInfo(userId, request.session.currentUser._id).then(data => {
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
