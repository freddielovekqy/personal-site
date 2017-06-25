var ChatListSchemaModule = require('../model/chatList.js');
var ChatList = ChatListSchemaModule.ChatList;

function save(currentUserId, chatUserId) {
    var chatList = new ChatList({
        userId: currentUserId,
        userList: [chatUserId]
    });
    return chatList.save();
}

function addChatList(currentUserId, chatUserId) {
    return ChatList.update({ userId: currentUserId }, { $addToSet: { userList: chatUserId } });
}

function findByUserId(userId) {
    return ChatList.findOne({ userId: userId }).lean().exec();
}

/**
 * 删除聊天列表中的用户
 * @param {String} userId
 * @param {String} chatUserId 
 */
function removeChatList(userId, chatUserId) {
    return ChatList.update({ userId: userId }, { $pull: { userList: chatUserId } });
}

module.exports.save = save;
module.exports.addChatList = addChatList;
module.exports.findByUserId = findByUserId;
module.exports.removeChatList = removeChatList;
