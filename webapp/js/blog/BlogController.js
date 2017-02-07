'use strict';

var blogModule = angular.module('blog', ['ngRoute', 'blogList']);

blogModule.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
        .when('/blog', { templateUrl: '/views/tlps/blog/list.html', controller: 'BlogListController' })
        .when('/blog/list', { templateUrl: '/views/tlps/blog/list.html', controller: 'BlogListController' })
        .when('/blog/list/:userId', { templateUrl: '/views/tlps/blog/list.html', controller: 'BlogListController' })
        .when('/blog/detail/:id', { templateUrl: '/views/tlps/blog/detail.html', controller: 'BlogDetailController' })
        .otherwise({ redirectTo: '/blog' });
}]);

blogModule.controller('BlogDetailController', ['$scope', function ($scope) {
    console.log('init blog detail controller');
}]);
