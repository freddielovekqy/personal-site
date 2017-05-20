var ChatLogSchema = require('../model/chatLog.js');
var ChatLog = ChatLogSchema.ChatLog;

const UNREAD_CHAT_LOG_STATUS = 2;
const READ_CHAT_LOG_STATUS = 1;

function save(chatLogDTO) {
    var chatLogEntity = new ChatLog({
        fromUserId: chatLogDTO.fromUserId,
        toUserId: chatLogDTO.toUserId,
        contentType: chatLogDTO.contentType,
        content: chatLogDTO.content,
        status: chatLogDTO.status,
        createDate: chatLogDTO.createDate
    });
    return chatLogEntity.save();
}

function readUnReadMessage(userId, fromUserId) {
    return ChatLog.update({ toUserId: userId, fromUserId: fromUserId }, { $set: { status: READ_CHAT_LOG_STATUS } }, { multi: true });
}

function findByCondition(condition) {
    return ChatLog.find(condition).lean().exec();
}

function findHistoryLog(userId, communicatorId, paginationParams, sortObj) {
    return ChatLog
        .find({ $or: [{ fromUserId: userId, toUserId: communicatorId }, { fromUserId: communicatorId, toUserId: userId }] })
        .skip(paginationParams.startIndex)
        .limit(paginationParams.pageSize)
        .sort(sortObj)
        .lean()
        .exec();
}

function findAllHistoryLog() {

}

module.exports.save = save;
module.exports.readUnReadMessage = readUnReadMessage;
module.exports.findByCondition = findByCondition;
module.exports.findHistoryLog = findHistoryLog;