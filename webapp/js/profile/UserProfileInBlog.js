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

profileModule.controller('ProfileInBlogController', ['$scope', 'HttpService', 'StorageUtils',
    function ($scope, HttpService, StorageUtils) {
        var currentUser = StorageUtils.getSessionStorage('currentUser');
        // init();

        $scope.$watch(function () {
            return $scope.userId;
        }, function (newVal) {
            if (newVal && $scope.userId) {
                getUserInfo($scope.userId);
                getCountInfo($scope.userId);
            }
        });

        function getCountInfo(userId) {
            HttpService.get({
                url: 'api/blog/count/' + userId,
                success: function (data) {
                    $scope.countInfo = data;
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

        function getUserInfo(userId) {
            HttpService.get({
                url: 'api/user/' + userId,
                success: function (data) {
                    $scope.user = data;
                },
                error: function (data) {
                    console.log('get userInfo error');
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