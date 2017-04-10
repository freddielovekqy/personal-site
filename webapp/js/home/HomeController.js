'use strict';

var homeModule = angular.module('home', []);

homeModule.controller('HomeController', ['$scope', function ($scope) {

    var _this = this;

    console.log('home page init');

    $scope.hotTopics = [];

    for (var i = 0; i < 8; i++) {
        $scope.hotTopics.push({
            id: '',
            topicName: '极限挑战',
            topicIndex: 1999
        });
    }

}]);