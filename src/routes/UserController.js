var express = require('express');
var router = express.Router();
var userDao = require('../dao/UserDao');
var logger = require('../common/log/log4js').logger;

/* GET users listing. */
router.get('/', function (request, response, next) {
    response.send('respond with a resource');
});

router.post('/register', function (request, response, next) {
    var userDTO = {
        username: request.body.username,
        password: request.body.password
    };
    logger.info(userDTO);
    userDao.insert(userDTO);
    response.send(JSON.stringify(request.body));
});

module.exports = router;
