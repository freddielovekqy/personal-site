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
