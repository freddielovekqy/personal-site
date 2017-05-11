var express = require('express');
var router = express.Router();
var logger = require('../common/log/log4js').logger;
var homeService = require('../service/HomeService');

router.get('/content', (request, response, next) => {
    var userId = request.session.currentUser._id;
    homeService.findHomeContent(userId)
        .then(function (data) {
            response.send(JSON.stringify(data));
        }).catch(function (data) {
            response.send(JSON.stringify(data));
        });
});

module.exports = router;