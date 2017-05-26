var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var session = require('express-session');
var lessMiddleware = require('less-middleware');
var path = require('path');
var bodyParser = require('body-parser');
var log4js = require('./src/common/log/log4js');
_ = require('lodash');
var serverName = process.env.NAME || 'Unknown';

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
var chatLog = require('./src/routes/ChatLogController');

var chatLogService = require('./src/service/ChatLogService')

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

/**
 * 设置session
 */
app.use(session({
  secret: 'sessiontest', // 建议使用 128 个字符的随机字符串
  cookie: { maxAge: 6000 * 1000 }
}));

/**
 * 启动NodeJS服务器，端口号为8080
 */
server.listen(8080, function () {
  console.log('Server listening at port 8080');
});

// 前端资源文件全部交由nginx服务器进行管理
app.use(express.static(path.join(__dirname, 'webapp')));

// 处理get请求
app.get('/api/*', function (req, res, next) {
    log4js.logger.info('currentUser', req.session.currentUser);
    next();
});

// 处理post请求
app.post('/api/*', function (req, res, next) {
    log4js.logger.info('currentUser', req.session.currentUser);
    next();
});

// 处理put请求
app.put('/api/*', function (req, res, next) {
    log4js.logger.info('currentUser', req.session.currentUser);
    next();
});

// 处理delete请求
app.delete('/api/*', function (req, res, next) {
    log4js.logger.info('currentUser', req.session.currentUser);
    next();
});

/**
 * 将不同url的请求分发到不同的文件处理
 */
app.use('/api/user', user);
app.use('/api/blog', blog);
app.use('/api/simpleBlog', simpleBlog);
app.use('/api/userBlogInfo', userBlogInfo);
app.use('/api/comment', comment);
app.use('/api/relationship', relationship);
app.use('/api/album', album);
app.use('/api/photo', photo);
app.use('/api/home', home);
app.use('/api/chatLog', chatLog);

// nodejs提供restful的api接口
app.get('/api/about', function (request, response) {
    response.send('Hello World!');
});

/****************私聊功能模块代码******************/
var numUsers = 0;
var userSocketMap = {};

io.on('connection', function (socket) {

    socket.on('init', data => {
        console.log('init socket, userInfo', data._id);
        userSocketMap[data._id] = socket;
        io.emit('someBodyOn', data);
    });

    socket.on('privateChat', data => {
        console.log('private chat', data);
        var toSocket = userSocketMap[data.toUserId];
        
        if (toSocket) {
            toSocket.emit('privateChat', data);
        } 

        chatLogService.save({
            fromUserId: data.fromUserId,
            toUserId: data.toUserId,
            content: data.message,
            status: !!toSocket ? 1 : 2,
            createDate: new Date().getTime()
        });
    });

  socket.emit('my-name-is', serverName);

  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
