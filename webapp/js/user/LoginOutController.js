/**
 * Created by freddie on 2016/11/4.
 */
var loginOutModule = angular.module('loginOut', []);

loginOutModule.controller('LoginController', ['$scope', function ($scope) {
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
}]);