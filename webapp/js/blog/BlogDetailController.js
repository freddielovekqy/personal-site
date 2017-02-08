/**
 * Created by freddie on 2017/2/8.
 */
var blogDetailModule = angular.module('blogDetail', []);

blogDetailModule.controller('BlogDetailController', ['$scope', 'HttpService', '$routeParams',
    function ($scope, HttpService, $routeParams) {
        var blogId = $routeParams.blogId;
        console.log('blogId', blogId);
        function getBlogInfo(blogId) {
            HttpService.get({
                url: 'api/blog/getBlog/' + blogId,
                success: function (data) {
                    console.log('data', data);
                    $scope.blogInfo = data;
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

        getBlogInfo(blogId);
    }
]);