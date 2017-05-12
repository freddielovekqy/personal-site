var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var simpleBlogService = require('../service/SimpleBlogService');

router.post('/', (request, response, next) => {
    var simpleBlog = request.body.simpleBlog;
    simpleBlogService.saveSimpleBlog(request.session.currentUser._id, simpleBlog)
        .then(function (data) {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.delete('/:id', (request, response, next) => {
    var id = request.params.id;
    simpleBlogService.deleteSimpleBlog(id)
        .then(function (data) {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.get('/user/:userId', (request, response, next) => {
    var userId = request.params.userId;
    simpleBlogService.findSimpleBlogsByUser(userId)
        .then(function (data) {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

module.exports = router;