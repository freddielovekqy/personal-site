var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var commonUtils = require('../common/CommonUtils');
var blogService = require('../service/BlogService');
var blogCategoryService = require('../service/BlogCategoryService');

router.get('/list', function (request, response, next) {
    var blogUserId = request.query.userId;
    var visitUserId = request.session.currentUser._id;
    var paginationParams = commonUtils.generateBlogPaginationFromReq(request);

    var searchOptions = {
        title: request.query.title,
        type: request.query.type,
        categories: request.query.categories
    };

    var promise = blogService.getBlogsByUser(blogUserId, visitUserId, searchOptions, paginationParams);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
}); 

router.get('/', (request, response, next) => {
    var blogId = request.query.blogId;
    console.log('blogId', blogId);
    var promise = blogService.getBlogById(blogId);
    promise.then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.get('/count/:userId', (request, response, next) => {
    var userId = request.params.userId;
    blogService.countBlogsByType(userId)
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.send(JSON.stringify(data));
        }).catch(data => {
            response.send(JSON.stringify(data));
        });
});

router.get('/home', (request, response, next) => {
    var userId = request.session.currentUser._id;
    blogService.findAttentionBlogsByUser(userId)
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.send(JSON.stringify(data));
        }).catch(data => {
            response.send(JSON.stringify(data));
        });
});

router.get('/recent', (request, response, next) => {
    blogService.findRecentBlogs()
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.send(JSON.stringify(data));
        }).catch(data => {
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
    var blogDTO = request.body.blog;
    var blog = request.body.blog;
    console.log('blog', blog);

    var promise = blogService.saveBlog(blogDTO);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/update', function (request, response, next) {
    var blog = request.body.blog;
    logger.info('blog/update', blog);
    var promise = blogService.updateBlog(blog);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.delete('/:blogId', function (request, response, next) {
    var blogId = request.params.blogId;
    var promise = blogService.deleteBlog(blogId);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/topShow', function (request, response, next) {
    var id = request.body.id;
    var topShow = request.body.topShow;
    var promise = blogService.updateBlogAttr(id, 'topShow', topShow);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/commentAble', function (request, response, next) {
    var id = request.body.id;
    var commentAble = request.body.commentAble;
    var promise = blogService.updateBlogAttr(id, 'commentAble', commentAble);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

router.post('/createBlogCategory', function (request, response, next) {
    var blogCategoryDTO = {
        name: request.body.name,
        userId: request.session.currentUser._id
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
    var promise = blogCategoryService.getBlogCategorys(request.session.currentUser._id);
    promise.then(function (data) {
        response.send(JSON.stringify(data));
    }).catch(function (data) {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;