profileModule.directive('profileInBlog', function () {
    return {
        restrict : 'EA',
        replace : true,
        templateUrl: 'views/tlps/profile/profile_in_blog.html',
        controller: 'ProfileInBlogController',
        controllerAs: 'ProfileInBlogCtrl',
        link: function (scope, element, attrs) {
            console.log('link...');
        }
    };
});

profileModule.controller('ProfileInBlogController', ['$scope', function ($scope) {
    console.log('ProfileInBlogController');
}]);