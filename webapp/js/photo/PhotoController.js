/**
 * Created by freddie on 2017/5/6.
 */
var photoModule = angular.module('photo', ['ngRoute', 'albumDetail']);

photoModule.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
        .when('/photo', { templateUrl: '/views/tlps/photo/photo.html', controller: 'PhotoController' })
        .when('/album/:albumId', { templateUrl: '/views/tlps/photo/album_detail.html', controller: 'AlbumDetailController' });
}]);

photoModule.constant('PhotoConstant', {
    ALBUM_JURISDICTIONS: [
        {
            label: '所有人可见',
            value: 1
        }, {
            label: '仅好友可见',
            value: 2
        }, {
            label: '仅自己可见',
            value: 3
        }
    ]
});

photoModule.service('PhotoService', function () {
    var albums;
    function setAlbums(albumList) {
        albums = albumList;
    }

    function getAlbums() {
        return albums;
    }

    return {
        setAlbums: setAlbums,
        getAlbums: getAlbums
    }
});

photoModule.controller('PhotoController', ['$scope', '$compile', '$timeout', '$location', 'HttpService', 'PhotoService', 'CommonUserUtils',
    function ($scope, $compile, $timeout, $location, HttpService, PhotoService, CommonUserUtils) {
        $scope.currentUser = {};

        (function () {
            var result = CommonUserUtils.getCurrentUserInfo();
            if (result instanceof Promise) {
                result.then( (data) => {
                    $timeout(() => {
                        $scope.currentUser = data;
                        findAlbumsByUser($scope.currentUser._id);
                    }, 0);
                });
            } else {
                $scope.currentUser = result;
                findAlbumsByUser($scope.currentUser._id);
            }
        })();

        $scope.createAlbum = function () {
            var baseEle = $('.photo-popover-container');
            var ele = $compile('<edit-album-popover></edit-album-popover>')($scope.$new());
            baseEle.append(ele);
        };

        $scope.deleteAlbum = function (album) {
            HttpService.delete({
                url: 'api/album/' + album._id,
                success: (data) => {
                    findAlbumsByUser($scope.currentUser._id);
                }
            });
        };

        $scope.editAlbum = function (album) {
            var baseEle = $('.photo-popover-container');
            var newScope = $scope.$new();
            newScope.albumId = album._id;
            var ele = $compile('<edit-album-popover></edit-album-popover>')(newScope);
            baseEle.append(ele);
        };

        $scope.showAlbumPhotos = function (album) {
            $location.path('/album/' + album._id);
        };

        $scope.showAlbumOperationsClick = function (album, showOrHide) {
            album.showAlbumOperations = showOrHide;
        };

        function findAlbumsByUser(userId) {
            HttpService.get({
                url: 'api/album/user/' + userId,
                success: (data) => {
                    $scope.albums = data.map(album => {
                        album.showAlbumOperations = false;
                        return album;
                    });
                    PhotoService.setAlbums($scope.albums);
                }
            });
        }


        var updateAlbumListSub = postal.subscribe({
            channel: 'photo',
            topic: 'createOrUpdateAlbum',
            callback: data => {
                findAlbumsByUser($scope.currentUser._id);
            }
        });
    }
]);