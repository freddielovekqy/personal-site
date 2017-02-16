/**
 * Created by freddie on 2017/2/15.
 */
var blogManagerModule = angular.module('blogManager', []);

blogManagerModule.controller('BlogManagerController', ['$scope', '$compile', '$location', 'HttpService', 'SessionStorageUtils',
    function ($scope, $compile, $location, HttpService, SessionStorageUtils) {
        $scope.currentSelectTab = '';
        var currentUser = SessionStorageUtils.getItem('currentUser');

        init();

        function init() {
            var url = $location.$$path;
            var baseEle = $('.current-blog-page');
            if (url === '/blog/create') {
                $scope.currentSelectTab = 'create';
                var ele = $compile('<create-blog></create-blog>')($scope);
                baseEle.append(ele);
            } else if (url === '/blog/manager') {
                $scope.currentSelectTab = 'blogManager';
            } else if (url === '/blog/manager/type') {
                $scope.currentSelectTab = 'typeManager';
            } else if (url === '/blog/manager/comment') {
                $scope.currentSelectTab = 'commentManager';
            } else if (url === '/blog/draft') {
                $scope.currentSelectTab = 'draft';
            } else if (url === '/blog/recycle-bin') {
                $scope.currentSelectTab = 'recycleBin';
            } else {
                $location.path('/blog');
            }
            getUserInfo();
        }

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