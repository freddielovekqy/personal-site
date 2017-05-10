/**
 * Created by freddie on 2017/5/7.
 */
var albumDetailModule = angular.module('albumDetail', []);

albumDetailModule.controller('AlbumDetailController', ['$scope', '$compile', '$location', '$timeout', '$routeParams', 'HttpService', 'CommonUtils', 'CommonUserUtils', 'PhotoConstant', 'PhotoService',
    function ($scope, $compile, $location, $timeout, $routeParams, HttpService, CommonUtils, CommonUserUtils, PhotoConstant, PhotoService) {

        $scope.showMoreInfoFlag = false;
        $scope.multiOperate = false;
        $scope.albumJurisdictions = PhotoConstant.ALBUM_JURISDICTIONS;

        (function () {
            var result = CommonUserUtils.getCurrentUserInfo();
            if (result instanceof Promise) {
                result.then( (data) => {
                    $timeout(() => {
                        $scope.currentUser = data;
                    }, 0);
                });
            } else {
                $scope.currentUser = result;
            }
            findAlbumInfo($routeParams.albumId);
        })();

        /**
         * 批量操作图片
         */
        $scope.multiOperation = function () {
            $scope.multiOperate = !$scope.multiOperate;
            if (!$scope.multiOperate) {
                $scope.album.photos.forEach(photo => {
                    photo.option.checked = false;
                });
            }
        };

        /**
         * 全选操作
         */
        $scope.multiOperateSelectedAll = function () {
            var isAllSelected = true;
            $scope.album.photos.every(photo => {
                if (!photo.option.checked) {
                    isAllSelected = false;
                    return false;
                } else {
                    return true;
                }
            });
            $scope.album.photos = $scope.album.photos.map(photo => {
                photo.option.checked = !isAllSelected;
                return photo;
            });
        };

        /**
         * 删除选中的照片
         */
        $scope.deleteSelectedPhotos = function () {
            var deletePhotoIds = [];
            $scope.album.photos.forEach(photo => {
                photo.option.checked && deletePhotoIds.push(photo._id);
            });
            HttpService.delete({
                url: 'api/photo',
                params: {
                    albumId: $scope.album._id,
                    photoIds: deletePhotoIds
                },
                success: function (data) {
                    CommonUtils.showAlertMessage({
                        type: 'success',
                        message: '删除成功'
                    });
                    findAlbumInfo($scope.album._id);
                },
                error: function (data) {
                    CommonUtils.showAlertMessage({
                        type: 'danger',
                        message: '删除失败'
                    });
                }
            });
        };

        /**
         * 显示相册更多信息
         * @param event
         */
        $scope.showMoreInfo = function (event) {
            $scope.showMoreInfoFlag = true;
            event.stopPropagation && event.stopPropagation();
        };

        /**
         * 显示或隐藏照片操作界面
         * @param photo
         * @param showOrHide
         */
        $scope.showPhotoOperationsClick = function (photo, showOrHide) {
            photo.showPhotoOperations = showOrHide;
        };

        /**
         * 显示上传文件的弹框
         */
        $scope.uploadPhoto = function () {
            var baseEle = $('.photo-popover-container');
            var newScope = $scope.$new();
            newScope.albumId = $scope.album._id;
            var ele = $compile('<upload-photo-popover></upload-photo-popover>')(newScope);
            baseEle.append(ele);
        };

        /**
         * 设置当前图片为相册默认显示的图片
         * @param photo
         */
        $scope.setToCover = function (photo) {
            HttpService.put({
                url: `api/album/${$scope.album._id}/default-photo/${photo._id}`,
                success: function (data) {
                    CommonUtils.showAlertMessage({
                        type: 'success',
                        message: '设置成功'
                    });
                    findAlbumInfo($scope.album._id);
                }
            });
        };

        /**
         * 显示照片
         * @param photo
         */
        $scope.showPhoto = function (photo) {
            var baseEle = $('.photo-popover-container');
            var newScope = $scope.$new();
            newScope.album = $scope.album;
            newScope.photo = photo;
            newScope.currentUser = $scope.currentUser;
            var ele = $compile('<show-photo-popover></show-photo-popover>')(newScope);
            baseEle.append(ele);
        };

        /**
         * 编辑照片信息
         * @param photo
         */
        $scope.editPhoto = function (photo) {
            var baseEle = $('.photo-popover-container');
            var newScope = $scope.$new();
            newScope.albumId = $scope.album._id;
            newScope.photo = photo;
            var ele = $compile('<upload-photo-popover></upload-photo-popover>')(newScope);
            baseEle.append(ele);
        };

        /**
         * 删除当前照片
         * @param photo
         */
        $scope.deletePhoto = function (photo) {
            HttpService.delete({
                url: `api/photo/${photo._id}/album/${$scope.album._id}`,
                success: function (data) {
                    CommonUtils.showAlertMessage({
                        type: 'success',
                        message: '删除成功'
                    });
                    findAlbumInfo($scope.album._id);
                },
                error: function (data) {
                    CommonUtils.showAlertMessage({
                        type: 'danger',
                        message: '删除失败'
                    });
                }
            });
        };

        /**
         * 删除相册以及其中所有的照片
         */
        $scope.deleteAlbum = function () {
            HttpService.delete({
                url: 'api/album/' + $scope.album._id,
                success: (data) => {
                    $location.path('/photo')
                }
            });
        };

        /**
         * 编辑相册信息
         */
        $scope.editAlbum = function () {
            var baseEle = $('.photo-popover-container');
            var newScope = $scope.$new();
            newScope.albumId = $scope.album._id;
            var ele = $compile('<edit-album-popover></edit-album-popover>')(newScope);
            baseEle.append(ele);
        };

        /**
         * 获取相册信息以及其中的所有照片
         * @param albumId
         */
        function findAlbumInfo(albumId) {
            HttpService.get({
                url: 'api/album/' + albumId,
                success: (data) => {
                    $scope.album = data;
                    $scope.album.createDate = new Date($scope.album.createDate).format('yyyy-MM-dd hh:mm');
                    $scope.selectedJurisdiction = $scope.albumJurisdictions[_.findIndex($scope.albumJurisdictions, {value: $scope.album.jurisdiction})];
                    $scope.album.photos.forEach(photo => {
                        photo.showPhotoOperations = false;
                        photo.option = {
                            id: photo._id,
                            name: photo._id,
                            checked: false
                        };
                        photo.createDate = new Date(photo.createDate).format('yyyy-MM-dd hh:mm');
                        if ($scope.album.defaultPhotoId === photo._id) {
                            $scope.album.defaultPhoto = photo;
                        }
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

        var uploadSuccessSub = postal.subscribe({
            channel: 'upload',
            topic: 'uploadPhotoSuccess',
            callback: function (data) {
                findAlbumInfo($scope.album._id);
            }
        });

        var updateAlbumSub = postal.subscribe({
            channel: 'photo',
            topic: 'createOrUpdateAlbum',
            callback: function (data) {
                findAlbumInfo($scope.album._id);
            }
        });

        $scope.$on('$destroy', function () {
            $('body').unbind('click', hideMoreInfo);
            uploadSuccessSub && uploadSuccessSub.unsubscribe();
            updateAlbumSub && updateAlbumSub.unsubscribe();
        });
    }
]);