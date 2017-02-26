/**
 * Created by freddie on 2016/11/4.
 */
var loginOutModule = angular.module('loginOut', []);

loginOutModule.constant('LoginConstants', {
    ENTER_KEY_CODE: 13
});

loginOutModule.controller('LoginController', ['$scope', 'HttpService', '$location', 'LoginConstants', 'StorageUtils',
    function ($scope, HttpService, $location, LoginConstants, StorageUtils) {
        $scope.option = {
            id: 'rememberCheckbox',
            name: 'rememberCheckbox',
            label: '下次自动登录',
            checked: true,
            disabled: false
        };

        $scope.$watch(function () {
            return $scope.option.checked;
        }, function () {
            console.log($scope.option.checked);
        });

        $scope.login = function () {
            console.log($scope.email);
            HttpService.post({
                url: 'api/user/login',
                params: {
                    email: $scope.email,
                    password: $scope.password
                },
                success: function (data) {
                    console.log('login success...', data);
                    if (data && data._id) {
                        StorageUtils.setSessionStorage('currentUser', data);
                        StorageUtils.setLocalStorage('currentUserId', data._id)
                        $scope.$emit('loginSuccess', data);
                        $location.url('/');
                    } else {
                        $scope.password = '';
                    }
                },
                error: function () {
                    console.log('login error...');
                }
            });
        };

        $scope.enterLogin = function ($event) {
            var keyCode = $event.keyCode || $event.which;
            if (keyCode === LoginConstants.ENTER_KEY_CODE) {
                $scope.login();
            }
        };
    }]);