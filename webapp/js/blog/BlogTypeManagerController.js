/**
 * Created by freddie on 2017/2/19.
 */
var blogTypeModule = angular.module('blogType', []);

blogTypeModule.controller('BlogTypeManagerController', ['$scope',
    function ($scope) {

    }
]);

blogTypeModule.directive('blogTypeManager', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/blog/type_manager.html',
        controller: 'BlogTypeManagerController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});