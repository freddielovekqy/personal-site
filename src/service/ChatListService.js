var chatListDao = require('../dao/ChatListDao');
var userDao = require('../dao/UserDao');

function addChatList(currentUserId, chatUserId) {
    return new Promise((resolve, reject) => {
        chatListDao.findByUserId(currentUserId)
            .then(chatListEntity => {
                if (chatListEntity) {
                    return chatListDao.addChatList(currentUserId, chatUserId);
                } else {
                    return chatListDao.save(currentUserId, chatUserId);
                }
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function removeChatList(currentUserId, chatUserId) {
    return new Promise((resolve, reject) => {
        chatListDao.removeChatList(currentUserId, chatUserId)
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
}

function findChatList(currentUserId) {
    return new Promise((resolve, reject) => {
        var chatList = {};
        chatListDao.findByUserId(currentUserId)
            .then(entity => {
                if (!entity) {
                    resolve(entity);
                } else {
                    chatList = entity;
                    var getUserInfoPromises = [];

                    entity.userList.forEach(userId => {
                        getUserInfoPromises.push(userDao.getBasicUserInfo(userId));
                    });
                    return Promise.all(getUserInfoPromises);
                }
            })
            .then(userInfos => {
                chatList.userList = userInfos;
                resolve(chatList);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.addChatList = addChatList;
module.exports.removeChatList = removeChatList;
module.exports.findChatList = findChatList;