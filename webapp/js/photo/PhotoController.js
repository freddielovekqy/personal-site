/**
 * Created by freddie on 2017/5/6.
 */
var photoModule = angular.module('photo', []);

photoModule.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
        .when('/photo', { templateUrl: '/views/tlps/photo/photo.html', controller: 'PhotoController' });
}]);

photoModule.controller('PhotoController', ['$scope', '$compile',
    function ($scope, $compile) {
        $scope.showAlbumOperations = false;

        $scope.createAlbum = function () {
            var baseEle = $('.photo-popover-container');
            var ele = $compile('<edit-album-popover></edit-album-popover>')($scope.$new());
            baseEle.append(ele);
        };

        $scope.showAlbumOperationsClick = function (showOrHide) {
            $scope.showAlbumOperations = showOrHide;
        };


        var updateAlbumListSub = postal.subscribe({
            channel: 'photo',
            topic: 'createOrUpdateAlbum',
            callback: data => {

            }
        });
    }
]);