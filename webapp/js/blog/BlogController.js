'use strict';

var blogModule = angular.module('blog', ['ngRoute', 'blogList', 'blogDetail']);

blogModule.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
        .when('/blog', { templateUrl: '/views/tlps/blog/list.html', controller: 'BlogListController' })
        .when('/blog/list', { templateUrl: '/views/tlps/blog/list.html', controller: 'BlogListController' })
        .when('/blog/list/:userId', { templateUrl: '/views/tlps/blog/list.html', controller: 'BlogListController' })
        .when('/blog/detail/:blogId', { templateUrl: '/views/tlps/blog/detail.html', controller: 'BlogDetailController' })
        .otherwise({ redirectTo: '/blog' });
}]);

blogModule.service('BlogService', [
    function () {
        function getBlogType(blog) {
            if (blog.type === '原创') {
                blog.typeShow = '原';
                blog.type = 'origin';
            } else if (blog.type === '转载') {
                blog.typeShow = '转';
                blog.type = 'reprint';
            } else if (blog.type === '译文') {
                blog.typeShow = '译';
                blog.type = 'translation';
            }
            return blog;
        }

        return {
            getBlogType: getBlogType
        };
    }
]);
