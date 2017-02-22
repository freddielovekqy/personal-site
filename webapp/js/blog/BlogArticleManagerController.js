var blogArticleModule = angular.module('blogArticleManager', []);

blogArticleModule.controller('BlogArticleManagerController', ['$scope',
    function ($scope) {

    }
]);

blogArticleModule.directive('blogArticleManager', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/blog/blog_article_manager.html',
        controller: 'BlogArticleManagerController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});