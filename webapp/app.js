'use strict';

var app = angular.module('app', ['ngRoute', 'home', 'about', 'blog', 'profile']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', { templateUrl: '/views/home.html', controller: 'HomeController' })
        .when('/about', { templateUrl: '/views/tlps/about.html', controller: 'AboutController' })
        .otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode(true);
}]);

app.controller('initController', ['$scope', '$location', '$timeout', function ($scope, $location, $timeout) {
    $scope.showHeader = true;
    $scope.currentPath = getRootPath($location.path());

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