/**
 * Created by freddie on 2017/2/15.
 */
var blogManagerModule = angular.module('blogManager', []);

blogManagerModule.controller('BlogManagerController', ['$scope', '$compile', '$location', 'HttpService', 'StorageUtils',
    function ($scope, $compile, $location, HttpService, StorageUtils) {
        $scope.currentSelectTab = '';
        $scope.currentUser = StorageUtils.getSessionStorage('currentUser');

        init();

        function init() {
            var url = $location.$$path;
            var baseEle = $('.current-blog-page');
            if (url === '/blog/create') {
                $scope.currentSelectTab = 'create';
                var ele = $compile('<edit-blog></edit-blog>')($scope);
                baseEle.append(ele);
            } else if (url === '/blog/manager') {
                $scope.currentSelectTab = 'blogManager';
                var ele = $compile('<blog-article-manager></blog-article-manager>')($scope);
                baseEle.append(ele);
            } else if (url === '/blog/manager/category') {
                $scope.currentSelectTab = 'categoryManager';
                var ele = $compile('<blog-category-manager></blog-category-manager>')($scope);
                baseEle.append(ele);
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
                url: 'api/user/getUserInfo/' + $scope.currentUser._id,
                success: function (data) {
                    $scope.userInfo = data;
                },
                error: function (data) {
                }
            });
        }

    }
]);