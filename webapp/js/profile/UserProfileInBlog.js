/**
 * Created by freddie on 2017/2/8.
 */
profileModule.directive('profileInBlog', function () {
    return {
        restrict : 'EA',
        replace : true,
        scope: {
            userId: '='
        },
        templateUrl: 'views/tlps/profile/profile_in_blog.html',
        controller: 'ProfileInBlogController',
        controllerAs: 'ProfileInBlogCtrl',
        link: function (scope, element, attrs) {
            console.log('link...');
        }
    };
});

profileModule.controller('ProfileInBlogController', ['$scope', 'HttpService', 'SessionStorageUtils',
    function ($scope, HttpService, SessionStorageUtils) {
        var currentUser = SessionStorageUtils.getItem('currentUser');
        // init();

        $scope.$watch(function () {
            return $scope.userId;
        }, function (newVal) {
            if (newVal && $scope.userId) {
                getUserInfo($scope.userId);
            }
        });

        function getUserInfo(userId) {
            HttpService.get({
                url: 'api/userBlogInfo/getInfo/' + userId,
                success: function (data) {
                    $scope.userBlogInfo = data.userBlogInfo;
                    $scope.user = data.userInfo;
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

        // function init() {
        //     console.log('$scope.userId', $scope.userId);
        //     if ($scope.userId) {
        //         getUserInfo($scope.userId);
        //     }
        // }
    }
]);