'use strict';

var indexModel = angular.module('init', []);

indexModel.controller('WelcomeCtrl', ['$scope',
    function ($scope) {
        $scope.name = 'Freddie';
    }]);

indexModel.controller('AboutCtrl', ['$scope',
    function ($scope) {
        $scope.name = 'Freddie';
        console.log('about/.....')

        $.ajax({
            url: '/api/about',
            type: 'get',
            success: function (data) {
                console.log('data', data)
            }
        });

    }]);