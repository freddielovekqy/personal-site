var registerModule = angular.module('register', []);

registerModule.controller('RegisterController', ['$scope', function ($scope) {
    $scope.option = {
        id: 'rememberCheckbox',
        name: 'rememberCheckbox',
        label: '注册完成后自动登录',
        checked: true,
        disabled: false
    };
}]);