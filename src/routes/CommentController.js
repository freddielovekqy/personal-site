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
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.delete('/', (request, response, next) => {
    var commentId = request.query.commentId;
    commentService.deleteComment(commentId).then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.get('/', (request, response, next) => {
    var userId = request.query.userId;
    commentService.findCommentsByUser(userId).then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;