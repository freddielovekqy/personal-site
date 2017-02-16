/**
 * Created by freddie on 2017/2/15.
 */
var createBlogModule = angular.module('createBlog', []);

createBlogModule.controller('CreateBlogController', ['$scope',
    function ($scope) {
        console.log('init create blog page');
        $scope.$watch('content', function (newVal)　{
            console.log(newVal);
        });
    }
]);

createBlogModule.directive('createBlog', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/blog/create.html',
        controller: 'CreateBlogController',
        link: function (scope, elements, attrs, ngModel) {

        }
    }
});