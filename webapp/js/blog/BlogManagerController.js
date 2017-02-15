/**
 * Created by freddie on 2017/2/15.
 */
var blogManagerModule = angular.module('blogManager', []);

blogManagerModule.controller('BlogManagerController', ['$scope', 'HttpService', 'SessionStorageUtils',
    function ($scope, HttpService, SessionStorageUtils) {
        var currentUser = SessionStorageUtils.getItem('currentUser');

        getUserInfo();
        function getUserInfo() {
            HttpService.get({
                url: 'api/user/getUserInfo/' + currentUser._id,
                success: function (data) {
                    $scope.userInfo = data;
                },
                error: function (data) {
                    console.log('get user info error');
                }
            });
        }

    }
]);