var ChatLogSchema = require('../model/chatLog.js');
var ChatLog = ChatLogSchema.ChatLog;

function save(chatLogDTO) {
    var chatLogEntity = new ChatLog({
        fromUserId: chatLogDTO.fromUserId,
        toUserId: chatLogDTO.toUserId,
        contentType: chatLogDTO.contentType,
        content: chatLogDTO.content,
        status: chatLogDTO.status,
    });
    return chatLogEntity.save();
}

function findByCondition(condition) {
    return ChatLog.find(condition).lean().exec();
}

function findHistoryLog(userId, communicatorId, paginationParams, sortObj) {
    return ChatLog
        .find({$or: [{fromUserId: userId, toUserId: communicatorId}, {fromUserId: communicatorId, toUserId: userId}]})
        .skip(paginationParams.startIndex)
        .limit(paginationParams.pageSize)
        .sort(sortObj)
        .lean()
        .exec();
}

function findAllHistoryLog() {

}

module.exports.save = save;
module.exports.findByCondition = findByCondition;
module.exports.findHistoryLog = findHistoryLog;