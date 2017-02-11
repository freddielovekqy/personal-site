/**
 * Created by freddie on 2017/2/8.
 */
var blogDetailModule = angular.module('blogDetail', []);

blogDetailModule.controller('BlogDetailController', ['$scope', 'HttpService', '$routeParams', 'BlogService',
    function ($scope, HttpService, $routeParams, BlogService) {
        var blogId = $routeParams.blogId;
        console.log('blogId', blogId);
        function getBlogInfo(blogId) {
            HttpService.get({
                url: 'api/blog/getBlog/' + blogId,
                success: function (data) {
                    console.log('data', data);
                    data.createDate = new Date(data.createDate).format('yyyy-MM-dd hh:mm:ss');
                    data.lastUpdateDate = new Date(data.lastUpdateDate).format('yyyy-MM-dd hh:mm:ss');
                    $scope.blogInfo = BlogService.getBlogType(data);
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

        getBlogInfo(blogId);
    }
]);