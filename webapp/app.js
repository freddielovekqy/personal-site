'use strict';

var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ui.grid', 'home', 'about', 'blog', 'profile', 'loginOut', 'register', 'account-setting']);

Date.prototype.format = function(format) {
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    };

    if(/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o) {
        if(new RegExp("("+ k +")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return format;
};
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', { templateUrl: '/views/home.html', controller: 'HomeController' })
        .when('/about', { templateUrl: '/views/tlps/about.html', controller: 'AboutController' })
        .when('/login', {templateUrl: '/views/tlps/user/login.html', controller: 'LoginController'})
        .when('/register', {templateUrl: '/views/tlps/user/register.html', controller: 'RegisterController'})
        .when('/account-setting', {templateUrl: '/views/tlps/accountSetting/account-setting.html', controller: 'AccountSettingController'})
        .otherwise({ redirectTo: '/' });
    $locationProvider.html5Mode(true);
}]);

app.controller('initController', ['$rootScope', '$scope', '$location', '$timeout', 'CommonUtils', 'SessionStorageUtils',
    function ($rootScope, $scope, $location, $timeout, CommonUtils, SessionStorageUtils) {
        $scope.showHeader = true;
        $scope.showLoginBtn = false;
        $scope.currentPath = getRootPath($location.path());

        $rootScope.$on('$locationChangeStart', function () {
            $scope.currentPath = getRootPath($location.path());
            $scope.showLoginBtn = ($scope.currentPath === '/login' || $scope.currentPath === '/register');
        });

        $scope.$on('loginSuccess', function () {
            $scope.currentUser = SessionStorageUtils.getItem('currentUser');
        });


        console.log('$scope.currentPath', $scope.currentPath);

        $scope.changePath = function (path) {
            $scope.currentPath = getRootPath(path);
        };

        $scope.currentUser = SessionStorageUtils.getItem('currentUser');
        console.log($scope.currentUser);

        function getRootPath (path) {
            var pathList = path.split('/');
            return '/' + path.split('/')[1];
        }

        $scope.$on('showAlertMessage', function (name, data) {
            $scope.alertObj = data;
            $timeout(function () {
                $scope.alertObj = null;
            }, 2000);
        });

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