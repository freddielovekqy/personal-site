'use strict';

var indexModel = angular.module('init', []);

indexModel.controller('WelcomeCtrl', ['$scope',
    function ($scope) {
        $scope.name = 'Freddie';
    }]);