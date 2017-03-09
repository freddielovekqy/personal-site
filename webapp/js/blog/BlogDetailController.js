/**
 * Created by freddie on 2017/2/8.
 */
var blogDetailModule = angular.module('blogDetail', []);

blogDetailModule.controller('BlogDetailController', ['$scope', '$sce', 'HttpService', '$routeParams', '$location', 'BlogService',
    function ($scope, $sce, HttpService, $routeParams, $location, BlogService) {
        var blogId = $routeParams.blogId;

        $scope.editBlog = function () {
            $location.path('/blog/edit/' + $scope.blogInfo._id);
        };

        $scope.removeBlog = function () {
            HttpService.post({
                url: 'api/blog/delete/' + $scope.blogInfo._id,
                success: function (data) {
                    $location.path('/blog');
                }
            });
        };

        function getBlogInfo(blogId) {
            HttpService.get({
                url: 'api/blog/getBlog/' + blogId,
                success: function (data) {
                    data.createDate = new Date(data.createDate).format('yyyy-MM-dd hh:mm:ss');
                    data.lastUpdateDate = new Date(data.lastUpdateDate).format('yyyy-MM-dd hh:mm:ss');
                    $scope.blogInfo = BlogService.getBlogType(data);
                    $scope.blogInfo.content = $sce.trustAsHtml($scope.blogInfo.content);
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

        getBlogInfo(blogId);
    }
]);