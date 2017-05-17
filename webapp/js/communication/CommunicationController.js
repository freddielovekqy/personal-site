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
            $scope.status = 'folding';
            $scope.communicationMessage = '';
            $scope.searchUserInfo = {};
            $scope.searchResults = [];
            $scope.communicators = [];
            $scope.currentCommunicator = {};
            $scope.messages = [];

            var noticeNewMessageInterval;

            var socket = io();
            // 引用该指令的地方限定了有currentUser才编译，所以可以确定currentUser有值
            $scope.userInfo = CommonUserUtils.getCurrentUserInfo();

            $scope.changeStatus = function (status) {
                $scope.status = status;
                clearInterval(noticeNewMessageInterval);
                $('.communication-folding').removeClass('new-message-coming-when-folding');
            };

            $scope.communicate = function (user) {
                $scope.communicators.unshift(angular.copy(user));
                $scope.currentCommunicator = $scope.communicators[0];
                $scope.searchResults = [];
                $scope.searchUserInfo = {};
            };

            $scope.removeCommunicator = function (user) {
                $scope.communicators = $scope.communicators.filter(communicator => {
                    return communicator._id !== user._id;
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
                $scope.messages.push({
                    username: $scope.userInfo.username,
                    sendTime: new Date().format('MM-dd hh:mm'),
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

            socket.emit('init', $scope.userInfo);

            socket.on('privateChat', privateChatData => {
                console.log('privateChat', privateChatData);
                if ($scope.status === 'folding') {
                    newMessageComingWhenFolding();
                }
                var userIndex = _.findIndex($scope.communicators, {_id: privateChatData.fromUserId});
                var promise = new Promise((resolve, reject) => {
                    if (userIndex === -1) {
                        HttpService.get({
                            url: `api/user/${privateChatData.fromUserId}`,
                            success: user => {
                                $scope.communicators.unshift(angular.copy(user));
                                userIndex = 0;
                                resolve({});
                            }
                        });
                    } else {
                        resolve({});
                    }
                });
                promise.then(data => {
                    $timeout(() => {
                        $scope.currentCommunicator = $scope.communicators[userIndex];
                        $scope.searchResults = [];
                        $scope.searchUserInfo = {};
                        $scope.messages.push({
                            username: $scope.currentCommunicator.username,
                            sendTime: new Date().format('MM-dd hh:mm'),
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
        }],
        link: function(scope, element, attrs, ngModel) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});