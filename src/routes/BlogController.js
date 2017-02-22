var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var commonUtils = require('../common/CommonUtils');
var blogService = require('../service/BlogService');
var blogCategoryService = require('../service/BlogCategoryService');

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

router.get('/getBlog/:blogId', function (request, response, next) {
    var blogId = request.params.blogId;
    var promise = blogService.getBlogById(blogId);
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

router.post('/createBlogCategory', function (request, response, next) {
    var blogCategoryDTO = {
        name: request.body.name,
        userId: request.session.currentUser.id
    };
    var promise = blogCategoryService.save(blogCategoryDTO);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/updateBlogCategory', function (request, response, next) {
    var id = request.body.id;
    var name = request.body.name;
    var promise = blogCategoryService.update(id, name);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/deleteBlogCategory/:id', function (request, response, next) {
    var id = request.params.id;
    var promise = blogCategoryService.deleteBlogCategory(id);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.get('/getBlogCategory', function (request, response, next) {
    var promise = blogCategoryService.getBlogCategorys(request.session.currentUser.id);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;