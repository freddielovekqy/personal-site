var registerModule = angular.module('register', []);

registerModule.controller('RegisterController', ['$scope', '$http', 'HttpService', function ($scope, $http, HttpService) {
    $scope.option = {
        id: 'rememberCheckbox',
        name: 'rememberCheckbox',
        label: '注册完成后自动登录',
        checked: true,
        disabled: false
    };
    $scope.user = {
        email: '',
        password: '',
        rePassword: ''
    };

    $scope.emailValid = {
        valid: true,
        msg: ''
    };

    $scope.passwordValid = {
        valid: true,
        msg: ''
    };

    $scope.rePasswordValid = {
        valid: true,
        msg: ''
    };

    $scope.register = function () {
        if (!registerValid()) {
            HttpService.post({
                url: '/api/user',
                params: {
                    user: $scope.user
                },
                success: function (data) {
                    console.log(data);
                    postal.publish({
                        channel: 'showAlertMessage',
                        topic: 'showAlertMessage',
                        data: {
                            type: 'success',
                            message: '注册成功'
                        }
                    });
                    if ($scope.option) {
                        HttpService.post({
                            url: 'api/user/login',
                            params: {
                                email: $scope.email,
                                password: $scope.password
                            },
                            success: data => {
                                postal.publish({
                                    channel: 'user',
                                    topic: 'loginSuccess',
                                    data: {}
                                });
                                $location.url('/login');
                            }
                        });
                    } else {
                        $location.url('/');
                    }
                }
            });
            //$http({
            //    url: '/api/user/register',
            //    method: 'POST',
            //    data: $scope.user
            //}).success(function (data) {
            //    console.log(data);
            //});
        }
    };

    $scope.changeEmail = function () {
        var result = {
            valid: true,
            errorMessage: ''
        };
        var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if ($scope.user.email === '') {
            result = {
                valid: false,
                errorMessage: '邮箱不能为空'
            };
        } else if (!filter.test($scope.user.email)) {
            result = {
                valid: false,
                errorMessage: '邮箱输入不合法'
            };
        }
        return result;
    };

    function registerValid () {
        if (!$scope.user.email || !$scope.password || $scope.password.length < 6 || $scope.password !== $scope.rePassword) {
            return false;
        } else {
            return true;
        }
    }
}]);