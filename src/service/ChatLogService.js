var chatLogDao = require('../dao/ChatLogDao');
var userDao = require('../dao/UserDao');
var logger = require('../common/log/log4js').logger;
var _ = require('lodash');

const UNREAD_CHAT_LOG_STATUS = 2;
// 查询聊天记录时，默认每次加载20个记录
const DEFAULT_HISTORY_LOG_PAGE_SIZE = 20;

function save(chatLog) {
    return new Promise((resolve, reject) => {
        chatLogDao.save(chatLog)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function readUnReadMessage(userId, fromUserId) {
    return new Promise((resolve, reject) => {
        chatLogDao.readUnReadMessage(userId, fromUserId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findUnreadMessage(userId) {
    return new Promise((resolve, reject) => {
        var results = [];
        var condition = {
            toUserId: userId,
            status: UNREAD_CHAT_LOG_STATUS
        };
        chatLogDao.findByCondition(condition)
            .then(chatLogs => {
                var getUserInfoPromises = [];

                chatLogs.forEach(chatLog => {
                    var userId = chatLog.fromUserId;
                    var index = _.findIndex(results, { fromUserId: userId });

                    if (index > -1) {
                        results[index].messages.push(chatLog);
                    } else {
                        getUserInfoPromises.push(userDao.getBasicUserInfo(userId));
                        results.push({
                            fromUserId: chatLog.fromUserId,
                            messages: [chatLog]
                        });
                    }
                });
                return Promise.all(getUserInfoPromises);
            })
            .then(userInfos => {
                results.forEach(result => {
                    userInfos.every(userInfo => {
                        if (userInfo._doc._id.toString() === result.fromUserId) {
                            result.userInfo = userInfo;
                            return false;
                        } else {
                            return true;
                        }
                    });
                });
                resolve(results);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findHistoryLog(userId, comunicatorId, startIndex) {
    return new Promise((resolve, reject) => {
        var paginationParams = {
            startIndex: startIndex,
            pageSize: DEFAULT_HISTORY_LOG_PAGE_SIZE,
        };
        var sortObj = { createDate: -1 };
        chatLogDao.findHistoryLog(userId, comunicatorId, paginationParams, sortObj)
            .then(chatLogs => {
                resolve(chatLogs.reverse());
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.save = save;
module.exports.readUnReadMessage = readUnReadMessage;
module.exports.findUnreadMessage = findUnreadMessage;
module.exports.findHistoryLog = findHistoryLog;