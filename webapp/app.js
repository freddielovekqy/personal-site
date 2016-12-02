'use strict';

var app = angular.module('app', ['ngRoute', 'home', 'about', 'blog', 'profile', 'loginOut', 'register']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', { templateUrl: '/views/home.html', controller: 'HomeController' })
        .when('/about', { templateUrl: '/views/tlps/about.html', controller: 'AboutController' })
        .when('/login', {templateUrl: '/views/tlps/user/login.html', controller: 'LoginController'})
        .when('/register', {templateUrl: '/views/tlps/user/register.html', controller: 'RegisterController'})
        .otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode(true);
}]);

app.controller('initController', ['$rootScope', '$scope', '$location', '$timeout', 'CommonUtils', function ($rootScope, $scope, $location, $timeout, CommonUtils) {
    $scope.showHeader = true;
    $scope.showLoginBtn = false;
    $scope.currentPath = getRootPath($location.path());

    $rootScope.$on('$locationChangeStart', function () {
        $scope.currentPath = getRootPath($location.path());
        $scope.showLoginBtn = ($scope.currentPath === '/login' || $scope.currentPath === '/register');
    });


    console.log('$scope.currentPath', $scope.currentPath);

    $scope.changePath = function (path) {
        $scope.currentPath = getRootPath(path);
    };

    function getRootPath (path) {
        var pathList = path.split('/');
        return '/' + path.split('/')[1];
    }

    //var lastScollPosition = 0;
    //$(window).scroll(function () {
    //    var currentScollPosition = $(window).scrollTop();
    //    console.log(lastScollPosition, currentScollPosition);
    //
    //    $timeout(function () {
    //        //$scope.showHeader = (lastScollPosition > currentScollPosition);
    //
    //    }, 0);
    //
    //    lastScollPosition = currentScollPosition;
    //});
}]);