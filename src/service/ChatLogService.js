var chatLogDao = require('../dao/ChatLogDao');
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

function findUnreadLog(userId) {
    return new Promise((resolve, reject) => {
        var condition = {
            toUserId: userId,
            status: UNREAD_CHAT_LOG_STATUS
        };
        chatLogDao.findByCondition(condition)
            .then(chatLogs => {
                var unreadLogMap = _.keyBy(chatLogs, 'fromUserId');
                resolve(unreadLogMap);
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
        var sortObj = { createDate: 1 };
        chatLogDao.findHistoryLog(userId, comunicatorId, paginationParams, sortObj)
            .then(chatLogs => {
                resolve(chatLogs);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.save = save;
module.exports.findUnreadLog = findUnreadLog;
module.exports.findHistoryLog = findHistoryLog;