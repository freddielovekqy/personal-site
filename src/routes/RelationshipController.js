var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var relationshipService = require('../service/RelationshipService');

router.post('/', (request, response, next) => {
    var userId = request.session.currentUser._id;
    var targetUserId = request.body.targetUserId;
    var attentionType = request.body.attentionType;
    var promise = relationshipService.addAttentionUser(userId, targetUserId, attentionType);
    promise.then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.delete('/attention/:targetUserId', (request, response, next) => {
    var userId = request.session.currentUser._id;
    var targetUserId = request.params.targetUserId;
    var promise = relationshipService.deleteAttention(userId, targetUserId);
    promise.then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.get('/:userId/fans', (request, response, next) => {
    var userId = request.params.userId;
    var promise = relationshipService.findFansByUser(userId);
    promise.then(data => {
        response.send(JSON.stringify(data));
    }, data => {
        response.send(JSON.stringify(data));
    }).catch(data => {
        response.send(JSON.stringify(data));
    });
});

router.get('/:userId/attentions', (request, response, next) => {
    var userId = request.params.userId;
    // TODO 未来需要添加权限操作，非本用户需要查看是否打开可以查看权限
    var promise = relationshipService.findUserAttentions(userId);
    promise.then(data => {
        response.send(JSON.stringify(data));
    });
});

router.get('/types', (request, response, next) => {
    var userId = request.session.currentUser._id;
    var promise = relationshipService.findAllUserAttentionTypes(userId);
    promise.then(data => {
        response.send(JSON.stringify(data));
    });
});

/**
 * 查询一个用户的所有关注类型中的用户个数
 */
router.get('/:userId/attentions/types', (request, response, next) => {
    var userId = request.params.userId;
    relationshipService.countAttentionsGroupByType(userId).then(data => {
        response.send(JSON.stringify(data));
    });
});

module.exports = router;