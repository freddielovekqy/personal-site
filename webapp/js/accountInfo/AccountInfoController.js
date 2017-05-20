/**
 * Created by freddie on 2017/3/10.
 */
'use strict';
var accountInfoModule = angular.module('account-info', ['ngRoute', 'accountInfoMain', 'accountInfoProfile', 'accountInfoRelationship', 'accountInfoPhoto', 'accountInfoAlbumDetail']);

accountInfoModule.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
        .when('/account-info', { templateUrl: '/views/tlps/accountInfo/account_info.html', controller: 'AccountInfoController' })
        .when('/account-info/:type', { templateUrl: '/views/tlps/accountInfo/account_info.html', controller: 'AccountInfoController' })
        .when('/account-info/:type/:typeId', { templateUrl: '/views/tlps/accountInfo/account_info.html', controller: 'AccountInfoController' })
        .otherwise({ redirectTo: '/account-info' });
}]);

accountInfoModule.controller('AccountInfoController', ['$scope', '$http', '$location', '$routeParams', '$compile', '$timeout', 'HttpService', 'StorageUtils', 'CommonUserUtils',
    function ($scope, $http, $location, $routeParams, $compile, $timeout, HttpService, StorageUtils, CommonUserUtils) {
        (function () {
            var result = CommonUserUtils.getCurrentUserBlogInfo();
            if (result instanceof Promise) {
                result.then( (data) => {
                    $timeout(() => {
                        showAccountInfo(data);
                    }, 0);
                });
            } else {
                showAccountInfo(result);
            }
        })();

        $scope.fileSelected = function () {
            var formData = new FormData();
            var file = document.querySelector('input[type=file]').files[0];
            formData.append('file', file);

            $http({
                method: 'PUT',
                url: 'api/user/userImage',
                data: formData,
                headers: {'Content-Type': undefined}
            }).then(function (data) {
                location.reload();
            });
        };

        $scope.showAccountInfoPage = function (pageType) {
            $location.path('/account-info/' + pageType);
        };

        function showAccountInfo(data) {
            $scope.userBlogInfo = data.userBlogInfo;
            $scope.user = data.userInfo;

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
            } else if (type === 'photo') {
                ele = $compile('<account-info-photo></account-info-photo>')($scope);
                baseEle.append(ele);
            } else if (type === 'album') {
                ele = $compile('<account-info-album-detail></account-info-album-detail>')($scope);
                baseEle.append(ele);
            } else if (type === 'relationship') {
                ele = $compile('<account-info-relationship current-user-id="' + $scope.user._id + '"></account-info-relationship>')($scope.$new());
                baseEle.append(ele);
            }
        }
    }
]);