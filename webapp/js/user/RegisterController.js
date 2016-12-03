var registerModule = angular.module('register', []);

registerModule.controller('RegisterController', ['$scope', '$http', function ($scope, $http) {
    $scope.option = {
        id: 'rememberCheckbox',
        name: 'rememberCheckbox',
        label: '注册完成后自动登录',
        checked: true,
        disabled: false
    };
    $scope.user = {
        username: '',
        password: '',
        rePassword: ''
    };

    $scope.register = function () {
        if (!registerValid()) {
            $http({
                url: '/api/user/register',
                method: 'POST',
                data: $scope.user
            }).success(function (data) {
                console.log(data);
            });
        }
    };

    function registerValid () {
        if (!$scope.user.username || !$scope.password || $scope.password.length < 6 || $scope.password !== $scope.rePassword) {
            return false;
        } else {
            return true;
        }
    }
}]);