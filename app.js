var express = require('express');
var lessMiddleware = require('less-middleware');
var path = require('path');
var bodyParser = require('body-parser')
var log4js = require('./src/common/log/log4js')

var routes = require('./src/routes/index');
var user = require('./src/routes/UserController');


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

// 前端资源文件全部交由nginx服务器进行管理
app.use(express.static(path.join(__dirname, 'webapp')));

app.use('/api/user', user);

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

app.listen(8888, function () {
    console.log('Server start, listen 8888 port...');
});


module.exports = app;
