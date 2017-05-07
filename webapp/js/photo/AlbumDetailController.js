/**
 * Created by freddie on 2017/5/7.
 */
var albumDetailModule = angular.module('albumDetail', []);

albumDetailModule.controller('AlbumDetailController', ['$scope', '$compile', '$timeout', '$routeParams', 'HttpService', 'PhotoConstant', 'PhotoService',
    function ($scope, $compile, $timeout, $routeParams, HttpService, PhotoConstant, PhotoService) {

        $scope.showMoreInfoFlag = false;
        $scope.albumJurisdictions = PhotoConstant.ALBUM_JURISDICTIONS;

        (function () {
            console.log($routeParams.albumId);
            findAlbumInfo($routeParams.albumId);
        })();

        $scope.showMoreInfo = function (event) {
            $scope.showMoreInfoFlag = true;
            event.stopPropagation && event.stopPropagation();
        };

        $scope.showPhotoOperationsClick = function (photo, showOrHide) {
            photo.showPhotoOperations = showOrHide;
        };

        $scope.uploadPhoto = function () {
            var baseEle = $('.photo-popover-container');
            var newScope = $scope.$new();
            newScope.albumId = $scope.album._id;
            var ele = $compile('<upload-photo-popover></upload-photo-popover>')(newScope);
            baseEle.append(ele);
        };

        $scope.setToCover = function (photo) {

        };

        $scope.deletePhoto = function (photo) {
            HttpService.delete({
                url: `api/photo/${photo._id}/album/${$scope.album._id}`,
                success: function (data) {
                    postal.publish({
                        channel: 'showAlertMessage',
                        topic: 'showAlertMessage',
                        data: {
                            type: 'success',
                            message: '删除成功'
                        }
                    });
                    findAlbumInfo($scope.album._id);
                }
            });
        };

        function findAlbumInfo(albumId) {
            HttpService.get({
                url: 'api/album/' + albumId,
                success: (data) => {
                    $scope.album = data;
                    $scope.album.createDate = new Date($scope.album.createDate).format('yyyy-MM-dd hh:mm');
                    $scope.selectedJurisdiction = $scope.albumJurisdictions[_.findIndex($scope.albumJurisdictions, {value: $scope.album.jurisdiction})];
                    $scope.album.photos.forEach(photo => {
                        photo.showPhotoOperations = false;
                    });

                    if (!PhotoService.getAlbums()) {
                        HttpService.get({
                            url: 'api/album/user/' + $scope.album.userId,
                            success: (data) => {
                                $scope.albums = data.map(album => {
                                    album.showAlbumOperations = false;
                                    return album;
                                });
                                PhotoService.setAlbums($scope.albums);
                            }
                        });
                    }
                }
            });
        }


        $('body').bind('click', hideMoreInfo);

        function hideMoreInfo(event) {
            console.log(111);
            $timeout(() => {
                $scope.showMoreInfoFlag = false;
            }, 0);
        }

        $scope.$on('$destroy', function () {
            $('body').unbind('click', hideMoreInfo);
        });
    }
]);