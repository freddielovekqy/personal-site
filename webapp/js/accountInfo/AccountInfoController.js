/**
 * Created by freddie on 2017/3/10.
 */
'use strict';
var accountInfoModule = angular.module('account-info', ['ngRoute', 'accountInfoMain', 'accountInfoProfile']);

accountInfoModule.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
        .when('/account-info', { templateUrl: '/views/tlps/accountInfo/account_info.html', controller: 'AccountInfoController' })
        .when('/account-info/:type', { templateUrl: '/views/tlps/accountInfo/account_info.html', controller: 'AccountInfoController' })
        .otherwise({ redirectTo: '/account-info' });
}]);

accountInfoModule.controller('AccountInfoController', ['$scope', '$location', '$routeParams', '$compile', 'HttpService', 'StorageUtils',
    function ($scope, $location, $routeParams, $compile, HttpService, StorageUtils) {
        var currentUser = StorageUtils.getSessionStorage('currentUser');
        (function () {
            getUserInfo(currentUser._id);
            var type = $routeParams.type;

            var baseEle = $('.account-content-div');
            var ele;
            $scope.accountInfoCurrentSelectTab = type;
            if (type === 'main') {
                ele = $compile('<account-info-main-page></account-info-main-page>')($scope);
                baseEle.append(ele);
            } else if (type === 'profile') {
                ele = $compile('<account-info-profile></account-info-profile>')($scope);
                baseEle.append(ele);
            }
        })();

        $scope.showAccountInfoPage = function (pageType) {
            $location.path('/account-info/' + pageType);
        };

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