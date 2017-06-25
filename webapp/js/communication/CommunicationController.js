/**
 * Created by freddie on 2017/5/14.
 */
var communicationModule = angular.module('communication', []);

communicationModule.directive('communicationDiv', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/communication/communication.html',
        controller: ['$scope', '$timeout', 'HttpService', 'CommonUserUtils', function ($scope, $timeout, HttpService, CommonUserUtils) {
            $scope.status = 'folding'; // 聊天窗口的状态
            $scope.communicationMessage = ''; // 新聊天信息
            $scope.searchUserInfo = {}; // 搜索信息
            $scope.searchResults = []; // 搜索显示的用户列表
            $scope.communicators = []; // 左边列表显示的聊天的人
            $scope.currentCommunicator = {
                messages: [],
                chatLogs: []
            }; // 当前聊天的人
            $scope.chatLogs = []; // 聊天记录信息列表
            $scope.noMoreChatLog = false;

            var noticeNewMessageInterval; // 新消息来时，如果窗口是收拢状态，则会在一定时间内窗口闪烁

            var socket = io();
            // 引用该指令的地方限定了有currentUser才编译，所以可以确定currentUser有值
            $scope.userInfo = CommonUserUtils.getCurrentUserInfo();

            getChatList();
            getUnReadMessage();

            $scope.changeStatus = function (status) {
                $scope.status = status;
                clearInterval(noticeNewMessageInterval);
                $('.communication-folding').removeClass('new-message-coming-when-folding');

                if ($scope.status === 'open' && $scope.currentCommunicator._id) {
                    HttpService.put({
                        url: `api/chatLog/read/${$scope.currentCommunicator._id}`,
                        success: data => {

                        }
                    });
                }
            };

            $scope.showMoreChatLog = function () {
                var startIndex = $scope.currentCommunicator.messages.length + $scope.currentCommunicator.chatLogs.length;
                HttpService.get({
                    url: `api/chatLog/history?communicatorId=${$scope.currentCommunicator._id}&startIndex=${startIndex}`,
                    success: chatLogs => {
                        if (chatLogs.length < 20) {
                            $scope.noMoreChatLog = true;
                        }
                        $scope.currentCommunicator.chatLogs = chatLogs.map(chatLog => {
                            var message = {
                                message: chatLog.content,
                                sendTime: new Date(chatLog.createDate).format('MM-dd hh:mm:ss')
                            };
                            if (chatLog.fromUserId === $scope.userInfo._id) {
                                message.username = $scope.userInfo.username;
                                message.isCurrentUser = true;
                            } else {
                                message.username = $scope.currentCommunicator.username;
                                message.isCurrentUser = false;
                            }
                            return message;
                        });
                    }
                });
            };

            $scope.communicate = function (user) {
                var index = _.findIndex($scope.communicators, {_id: user._id});

                if (index === -1) {
                    index = 0;
                    var communicator = angular.copy(user);
                    communicator.messages = [];
                    communicator.chatLogs = [];
                    $scope.communicators.unshift(communicator);

                    HttpService.post({
                        url: `/api/chatList/chatUser/${user._id}`
                    });
                }
                $scope.currentCommunicator = $scope.communicators[index];
                $scope.searchResults = [];
                $scope.searchUserInfo = {};
            };

            // 切换聊天的人
            $scope.changeCommunicator = function (newCommunicator) {
                if (newCommunicator._id === $scope.currentCommunicator._id) {
                    return;
                }
                $scope.communicators.every(communicator => {
                    if (communicator._id === newCommunicator._id) {
                        $scope.currentCommunicator = communicator;
                        return false;
                    } else {
                        return true;
                    }
                });

                $scope.searchResults = [];
                $scope.searchUserInfo = {};

                // 将于该聊天者的消息全部设置为已读状态
                HttpService.put({
                    url: `api/chatLog/read/${$scope.currentCommunicator._id}`,
                    success: data => {

                    }
                });
            };

            $scope.removeCommunicator = function (user) {
                $scope.communicators = $scope.communicators.filter(communicator => {
                    return communicator._id !== user._id;
                });

                HttpService.delete({
                    url: `/api/chatList/chatUser/${user._id}`
                });
            };

            var waitToSearch = false;
            $scope.searchUser = function () {
                if (!waitToSearch) {
                    waitToSearch = true;
                    $timeout(() => {
                        if ($scope.searchUserInfo.username) {
                            HttpService.get({
                                url: `api/relationship/${$scope.userInfo._id}/username/${$scope.searchUserInfo.username}`,
                                success: users => {
                                    $scope.searchResults = users;
                                }
                            });
                        } else {
                            $scope.searchResults = [];
                        }
                        waitToSearch = false;
                    }, 500);
                }
            };

            $scope.sendMessageKeyPress = function (event) {
                var keyCode = event.keyCode || event.which;
                (keyCode === 13) && $scope.sendMessage();
            };

            $scope.sendMessage = function () {
                socket.emit('privateChat', {
                    toUserId: $scope.currentCommunicator._id,
                    fromUserId: $scope.userInfo._id,
                    message: $scope.communicationMessage
                });
                $scope.currentCommunicator.messages.push({
                    username: $scope.userInfo.username,
                    sendTime: new Date().format('MM-dd hh:mm:ss'),
                    message: $scope.communicationMessage,
                    isCurrentUser: true
                });
                $scope.communicationMessage = '';
                $timeout(() => {
                    $('#messageContentDiv').scrollTop( $('#messageContentDiv')[0].scrollHeight );
                }, 0);
            };

            function newMessageComingWhenFolding() {
                noticeNewMessageInterval = setInterval(() => {
                    $('.communication-folding').toggleClass("new-message-coming-when-folding");
                }, 500);
                $timeout(() => {
                    clearInterval(noticeNewMessageInterval);
                }, 5500);
            }

            // 获取所有未读信息，并选中最后一个来信息者
            function getUnReadMessage() {
                HttpService.get({
                    url: '/api/chatLog/unRead',
                    success: chatLogsMaps => {
                        chatLogsMaps.forEach((chatLogMap, index) => {
                            var communicator = chatLogMap.userInfo;
                            communicator.chatLogs = [];
                            communicator.messages = chatLogMap.messages.map(message => {
                                return {
                                    message: message.content,
                                    sendTime: new Date(message.createDate).format('MM-dd hh:mm:ss'),
                                    username: communicator.username,
                                    isCurrentUser: false
                                };
                            });
                            $scope.communicators.unshift(communicator);
                            if (index === chatLogsMaps.length - 1) {
                                $scope.currentCommunicator = $scope.communicators[0];
                            }
                        });
                    }
                });
            }

            function getChatList() {
                HttpService.get({
                    url: '/api/chatList',
                    success: data => {
                        if (data && data.userList) {
                            data.userList.forEach(user => {
                                user.chatLogs = [];
                                user.messages = [];
                                $scope.communicators.push(user);
                            });
                        }
                    }
                });
            }

            var chatToOtherSub = postal.subscribe({
                channel: 'communication',
                topic: 'chatToOther',
                callback: data => {
                    var index = _.findIndex($scope.communicators, {_id: data._id});
                    if (index > -1) {
                        $scope.currentCommunicator = $scope.communicators[index];
                    } else {
                        var communicator = Object.assign({chatLogs: [], messages: []}, data);
                        $scope.communicators.unshift(communicator);
                        $scope.currentCommunicator = $scope.communicators[0];
                    }
                    $scope.changeStatus('open');
                }
            });

            /* -----------------------------聊天模块代码----------------------------- */
            socket.emit('init', $scope.userInfo);

            socket.on('privateChat', privateChatData => {
                console.log('privateChat', privateChatData);
                if ($scope.status === 'folding') {
                    newMessageComingWhenFolding();
                }
                var promise = setCommunicator(privateChatData.fromUserId);
                promise.then(data => {
                    $timeout(() => {
                        $scope.currentCommunicator = $scope.communicators[data.userIndex];
                        $scope.searchResults = [];
                        $scope.searchUserInfo = {};
                        $scope.currentCommunicator.messages.push({
                            username: $scope.currentCommunicator.username,
                            sendTime: new Date().format('MM-dd hh:mm:ss'),
                            message: privateChatData.message
                        });
                    }, 0);
                    $timeout(() => {
                        $('#messageContentDiv').scrollTop( $('#messageContentDiv')[0].scrollHeight );
                    }, 0);
                });
            });

            socket.on('someBodyOn', data => {
                console.log('someBodyOn', data);
            });

            socket.on('connect', function(){});
            socket.on('event', function(data){});
            socket.on('disconnect', function(){});
            socket.on('my-name-is', function(data){
                console.log(data);
            });

            function setCommunicator(fromUserId) {
                var userIndex = _.findIndex($scope.communicators, {_id: fromUserId});
                return new Promise((resolve, reject) => {
                    if (userIndex === -1) {
                        HttpService.get({
                            url: `api/user/${fromUserId}`,
                            success: user => {
                                var communicator = angular.copy(user);
                                communicator.messages = [];
                                communicator.chatLogs = [];
                                $scope.communicators.unshift(communicator);
                                userIndex = 0;
                                resolve({
                                    userIndex: userIndex
                                });
                            }
                        });
                    } else {
                        resolve({
                            userIndex: userIndex
                        });
                    }
                });
            }


            $scope.$on('$destroy', () => {
                chatToOtherSub && chatToOtherSub.unsubscribe();
            });
        }],
        link: function(scope, element, attrs, ngModel) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});