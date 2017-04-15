var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var commentService = require('../service/CommentService');

router.post('/', (request, response, next) => {
    var objectId = request.body.objectId;
    var comment = request.body.comment;
    var userId = request.session.currentUser.id;
    commentService.addComment(objectId, userId, comment).then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.status(400).send(JSON.stringify(data));
    }).catch(data => {
        response.status(500).send(JSON.stringify(data));
    });
});

router.delete('/:commentId', (request, response, next) => {
    var commentId = request.params.commentId;
    commentService.deleteComment(commentId).then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.get('/getCommentByUser', (request, response, next) => {
    var userId = request.query.userId;
    commentService.findCommentsByUser(userId).then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.get('/blog/:blogId', (request, response, next) => {
    var blogId = request.params.blogId;
    commentService.findCommentsByBlog(blogId).then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;