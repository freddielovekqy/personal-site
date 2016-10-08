'use strict';

var app = angular.module('app', ['ngRoute', 'init']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', { templateUrl: '/views/welcome.html', controller: 'WelcomeCtrl' })
        .when('/about', { templateUrl: '/views/tlps/about.html', controller: 'WelcomeCtrl' })
        .when('/my', { templateUrl: '/views/tlps/my.html', controller: 'WelcomeCtrl' })
        .when('/email', { templateUrl: '/views/tlps/email.html', controller: 'WelcomeCtrl' })
        .otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode(true);
}]);