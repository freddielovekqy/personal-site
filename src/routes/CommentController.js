var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var commentService = require('../service/CommentService');

router.post('/', (request, response, next) => {
    var objectId = request.body.objectId;
    var comment = request.body.comment;
    var userId = request.session.currentUser.id;
});