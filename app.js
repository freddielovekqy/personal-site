var express = require('express');
var session = require('express-session');
var lessMiddleware = require('less-middleware');
var path = require('path');
var bodyParser = require('body-parser');
var log4js = require('./src/common/log/log4js');
_ = require('lodash');

var routes = require('./src/routes/index');
var user = require('./src/routes/UserController');
var blog = require('./src/routes/BlogController');
var simpleBlog = require('./src/routes/SimpleBlogController');
var userBlogInfo = require('./src/routes/UserBlogInfoController');
var comment = require('./src/routes/CommentController');
var relationship = require('./src/routes/RelationshipController');
var photo = require('./src/routes/PhotoController');
var album = require('./src/routes/AlbumController');
var home = require('./src/routes/HomeController');

var app = express();


// view engine setup
log4js.use(app);
// app.use(log4js('dev'));
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(cookieParser());

// 将less转换成css文件，并定义存放目录
app.use(lessMiddleware('/less', {
    dest: '/css',
    pathRoot: path.join(__dirname, 'webapp'),
    debug: false
}));


app.use(session({
  secret: 'sessiontest', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 6000 * 1000 }
}));

// 前端资源文件全部交由nginx服务器进行管理
app.use(express.static(path.join(__dirname, 'webapp')));

app.get('/api/*', function (req, res, next) {
    log4js.logger.info('currentUser', req.session.currentUser);
    next();
});

app.post('/api/*', function (req, res, next) {
    log4js.logger.info('currentUser', req.session.currentUser);
    next();
});

app.put('/api/*', function (req, res, next) {
    log4js.logger.info('currentUser', req.session.currentUser);
    next();
});

app.delete('/api/*', function (req, res, next) {
    log4js.logger.info('currentUser', req.session.currentUser);
    next();
});

app.use('/api/user', user);
app.use('/api/blog', blog);
app.use('/api/simpleBlog', simpleBlog);
app.use('/api/userBlogInfo', userBlogInfo);
app.use('/api/comment', comment);
app.use('/api/relationship', relationship);
app.use('/api/album', album);
app.use('/api/photo', photo);
app.use('/api/home', home);

// nodejs提供restful的api接口
app.get('/api/about', function (request, response) {
    response.send('Hello World!');
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
// });

app.listen(8080, function () {
    console.log('Server start, listen 8080 port...');
});


module.exports = app;
