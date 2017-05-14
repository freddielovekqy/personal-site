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
        controller: ['$scope', '$timeout', 'CommonUserUtils', function ($scope, $timeout, CommonUserUtils) {
            $scope.status = 'folding';
            $scope.communicationMessage = '';
            var socket = io();
            // 引用该指令的地方限定了有currentUser才编译，所以可以确定currentUser有值
            $scope.userInfo = CommonUserUtils.getCurrentUserInfo();

            $scope.changeStatus = function (status) {
                $scope.status = status;
            };

            $scope.sendMessage = function () {
                socket.emit('privateChat', {
                    toUserId: '584cfea90f67c99014ef34ee',
                    fromUserId: '587392917f4965563176f95a',
                    message: $scope.communicationMessage
                });
            };

            socket.emit('init', $scope.userInfo);

            socket.on('privateChat', data => {
                console.log(data);
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