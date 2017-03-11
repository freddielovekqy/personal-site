var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var userBlogInfoService = require('../service/UserBlogInfoService');

router.get('/getInfo/:userId', function (request, response, next) {
    var userId = request.params.userId;
    var promise = userBlogInfoService.getUserBlogInfo(userId);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/save', function (request, response, next) {
    console.log('save 1111');
    var userBlogInfo = {
        userId: request.body.userId,
        level: request.body.level,
        totalHits: request.body.totalHits,
        integral: request.body.integral,
        ranking: request.body.ranking
    };
    logger.info('save user blog information', userBlogInfo);
    var promise = userBlogInfoService.saveUserBlogInfo(userBlogInfo);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (error) {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;