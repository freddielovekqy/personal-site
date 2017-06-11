var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;

var chatListService = require('../service/ChatListService');

router.post('/chatUser/:userId', (request, response, next) => {
    var currentUserId = request.session.currentUser._id;
    var chatListUserId = request.params.userId;

    chatListService.addChatList(currentUserId, chatListUserId)
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.send(JSON.stringify(data));
        }).catch(data => {
            response.send(JSON.stringify(data));
        });
});

router.delete('/chatUser/:userId', (request, response, next) => {
    var currentUserId = request.session.currentUser._id;
    var chatListUserId = request.params.userId;

    chatListService.removeChatList(currentUserId, chatListUserId)
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.send(JSON.stringify(data));
        }).catch(data => {
            response.send(JSON.stringify(data));
        });
});

router.get('/', (request, response, next) => {
    var currentUserId = request.session.currentUser._id;

    chatListService.findChatList(currentUserId)
        .then(data => {
            response.send(JSON.stringify(data));
        }, data => {
            response.send(JSON.stringify(data));
        }).catch(data => {
            response.send(JSON.stringify(data));
        });
});

module.exports = router;