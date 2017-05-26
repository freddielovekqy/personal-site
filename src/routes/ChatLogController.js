var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var chatLogService = require('../service/ChatLogService');

router.get('/history', (request, response, next) => {
    var userId = request.session.currentUser._id;
    var communicatorId = request.query.communicatorId;
    var startIndex = Number(request.query.startIndex);
    chatLogService.findHistoryLog(userId, communicatorId, startIndex)
        .then(data => {
            response.send(JSON.stringify(data));
        }, error => {
            response.status(400).send(JSON.stringify(error));
        })
        .catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.get('/unRead', (request, response, next) => {
    var userId = request.session.currentUser._id;
    chatLogService.findUnreadMessage(userId)
        .then(data => {
            response.send(JSON.stringify(data));
        }, error => {
            response.status(400).send(JSON.stringify(error));
        })
        .catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

router.put('/read/:fromUserId', (request, response, next) => {
    var userId = request.session.currentUser._id;
    var fromUserId = request.params.fromUserId;
    chatLogService.readUnReadMessage(userId, fromUserId)
        .then(data => {
            response.send(JSON.stringify(data));
        }, error => {
            response.status(400).send(JSON.stringify(error));
        })
        .catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

module.exports = router;