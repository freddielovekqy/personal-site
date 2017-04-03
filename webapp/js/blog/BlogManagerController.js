/**
 * Created by freddie on 2017/2/15.
 */
var blogManagerModule = angular.module('blogManager', []);

blogManagerModule.controller('BlogManagerController', ['$scope', '$compile', '$location', 'HttpService', 'StorageUtils', 'CommonUserUtils',
    function ($scope, $compile, $location, HttpService, StorageUtils, CommonUserUtils) {
        $scope.currentSelectTab = '';
        $scope.currentUser = StorageUtils.getSessionStorage('currentUser');

        init();

        function init() {
            var url = $location.$$path;
            var ele = '';
            var baseEle = $('.current-blog-page');
            if (url === '/blog/create' || url.indexOf('/blog/edit') > -1) {
                $scope.currentSelectTab = 'edit';
                ele = $compile('<edit-blog></edit-blog>')($scope);
                baseEle.append(ele);
            } else if (url === '/blog/manager') {
                $scope.currentSelectTab = 'blogManager';
                ele = $compile('<blog-article-manager></blog-article-manager>')($scope);
                baseEle.append(ele);
            } else if (url === '/blog/manager/category') {
                $scope.currentSelectTab = 'categoryManager';
                ele = $compile('<blog-category-manager></blog-category-manager>')($scope);
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
            var result = CommonUserUtils.getCurrentUserInfo();
            if (result && result instanceof Promise) {
                result.then(function (data) {
                    $scope.userInfo = data;
                });
            } else if (result) {
                $scope.userInfo = result;
            }
        }
        
        var updateUserInfoSub = postal.subscribe({
            channel: 'user',
            topic: 'updateUserInfo',
            callback: data => {
                getUserInfo();
            }
        });

        $scope.$on('destroy', () => {
            updateUserInfoSub.unsubscribe();
        });

    }
]);