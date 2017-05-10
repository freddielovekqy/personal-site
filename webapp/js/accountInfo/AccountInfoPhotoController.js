/**
 * Created by freddie on 2017/5/10.
 */
var accountInfoPhotoModule = angular.module('accountInfoPhoto', []);

accountInfoPhotoModule.controller('AccountInfoPhotoController', ['$scope', '$compile', '$location', 'HttpService', 'CommonUserUtils', 'PhotoService',
    function ($scope, $compile, $location, HttpService, CommonUserUtils, PhotoService) {
        $scope.isAccountInfoPage = true;
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

        $scope.uploadPhoto = function () {
            var baseEle = $('.photo-popover-container');
            var ele = $compile('<upload-photo-popover></upload-photo-popover>')($scope.$new());
            baseEle.append(ele);
        };

        $scope.createAlbum = function () {
            var baseEle = $('.photo-popover-container');
            var ele = $compile('<edit-album-popover></edit-album-popover>')($scope.$new());
            baseEle.append(ele);
        };

        $scope.deleteAlbum = function (album, event) {
            event && event.stopPropagation && event.stopPropagation();
            HttpService.delete({
                url: 'api/album/' + album._id,
                success: (data) => {
                    findAlbumsByUser($scope.currentUser._id);
                }
            });
        };

        $scope.editAlbum = function (album, event) {
            event && event.stopPropagation && event.stopPropagation();
            var baseEle = $('.photo-popover-container');
            var newScope = $scope.$new();
            newScope.albumId = album._id;
            var ele = $compile('<edit-album-popover></edit-album-popover>')(newScope);
            baseEle.append(ele);
        };

        $scope.showAlbumPhotos = function (album) {
            $location.path('/account-info/album/' + album._id);
        };

        $scope.showAlbumOperationsClick = function (album, showOrHide, event) {
            album.showAlbumOperations = showOrHide;
            event && event.stopPropagation && event.stopPropagation();
        };

        function findAlbumsByUser(userId) {
            HttpService.get({
                url: 'api/album/user/' + userId,
                success: (data) => {
                    $scope.albums = data.map(album => {
                        album.showAlbumOperations = false;
                        album.photos.every(photo => {
                            if (photo._id === album.defaultPhotoId) {
                                album.defaultPhoto = photo;
                                return false;
                            } else {
                                return true;
                            }
                        });
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

        $scope.$on('$destroy', function () {
            updateAlbumListSub && updateAlbumListSub.unsubscribe();
        });
    }
]);

accountInfoPhotoModule.directive('accountInfoPhoto', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/photo/photo.html',
        controller: 'AccountInfoPhotoController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});