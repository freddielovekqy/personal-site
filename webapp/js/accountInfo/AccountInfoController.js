/**
 * Created by freddie on 2017/3/10.
 */
'use strict';
var accountInfoModule = angular.module('account-info', ['ngRoute']);

accountInfoModule.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
        .when('/account-info', { templateUrl: '/views/tlps/accountInfo/account_info.html', controller: 'AccountInfoController' })
        .otherwise({ redirectTo: '/account-info' });
}]);

accountInfoModule.controller('AccountInfoController', ['$scope', 'HttpService', 'StorageUtils',
    function ($scope, HttpService, StorageUtils) {
        var currentUser = StorageUtils.getSessionStorage('currentUser');

        (function () {
            getUserInfo(currentUser._id);
        })();

        function getUserInfo(userId) {
            HttpService.get({
                url: 'api/userBlogInfo/getInfo/' + userId,
                success: function (data) {
                    $scope.userBlogInfo = data.userBlogInfo;
                    $scope.user = data.userInfo;
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }
    }
]);