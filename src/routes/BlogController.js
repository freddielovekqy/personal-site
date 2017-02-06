var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var commonUtils = require('../common/CommonUtils');
var blogService = require('../service/BlogService');

router.get('/list', function (request, response, next) {
    var blogUserId = request.query.userId;

    var paginationParams = commonUtils.generatePaginationFromReq(request);
    var isCurrentUser = false;
    console.log(blogUserId, paginationParams)
    if (request.session.currentUser && (!blogUserId || blogUserId === request.session.currentUser.id)) {
        isCurrentUser = true;
    }
    var promise = blogService.getBlogsByUser(blogUserId, paginationParams, isCurrentUser);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
}); 

router.post('/save', function (request, response, next) {
    var blogDTO = {
        title: request.body.title,
        summary: request.body.summary,
        keyword: request.body.keyword,
        content: request.body.content,
        type: request.body.type,
        isPublic: request.body.isPublic,
        // TODO userId以后全部使用session中的数据request.session.currentUser.id
        userId: request.body.userId,
        comment: [],
        reader: []
    };

    var promise = blogService.saveBlog(blogDTO);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;