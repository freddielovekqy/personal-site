    /**
 * Created by freddie on 2017/5/6.
 */
photoModule.directive('editAlbumPopover', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/photo/edit_album.html',
        controller: ['$scope', 'HttpService', 'PhotoConstant', function ($scope, HttpService, PhotoConstant) {
            var isUpdate = !!$scope.albumId;
            $scope.albumJurisdictions = PhotoConstant.ALBUM_JURISDICTIONS;

            if (isUpdate) {
                HttpService.get({
                    url: 'api/album/' + $scope.albumId,
                    success: (data) => {
                        $scope.album = data;
                        $scope.selectedJurisdiction = $scope.albumJurisdictions[_.findIndex($scope.albumJurisdictions, {value: $scope.album.jurisdiction})];
                    }
                });
            } else {
                $scope.selectedJurisdiction = $scope.albumJurisdictions[0];
            }

            $scope.save = function () {
                $scope.album.jurisdiction = $scope.selectedJurisdiction.value;
                var httpParams = {
                    url: 'api/album',
                    params: {
                        album: $scope.album
                    },
                    success: (data) => {
                        postal.publish({
                            channel: 'photo',
                            topic: 'createOrUpdateAlbum',
                            data: {}
                        });
                        postal.publish({
                            channel: 'showAlertMessage',
                            topic: 'showAlertMessage',
                            data: {
                                type: 'success',
                                message: isUpdate ? '更新成功' : '创建成功'
                            }
                        });
                    }
                };
                if (!isUpdate) {
                    HttpService.post(httpParams);
                } else {
                    HttpService.put(httpParams);
                }

                $scope.$destroy();
            };

            $scope.cancel = function () {
                $scope.$destroy();
            };
        }],
        link: function(scope, element, attrs, ngModel) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});

photoModule.directive('uploadPhotoPopover', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/photo/upload_photo.html',
        controller: ['$scope', '$http', '$timeout', 'HttpService', 'CommonUtils', 'PhotoService', function ($scope, $http, $timeout, HttpService, CommonUtils, PhotoService) {
            $scope.albums = PhotoService.getAlbums();
            $scope.selectedFile = {};
            if ($scope.albumId) {
                $scope.selectedAlbum = $scope.albums[_.findIndex($scope.albums, {_id: $scope.albumId})];
            } else {
                $scope.selectedAlbum = $scope.albums[0];
            }

            $scope.photoSelected = function () {
                var file = document.querySelector('#uploadPhoto').files[0];
                $timeout(function () {
                    $scope.selectedFile.name = file.name;
                }, 0);
            };

            $scope.update = function () {
                HttpService.put({
                    url: 'api/photo',
                    params: {
                        albumId: $scope.selectedAlbum._id,
                        photo: $scope.photo
                    },
                    success: (data) => {
                        CommonUtils.showAlertMessage({
                            type: 'success',
                            message: '更新成功'
                        });
                        postal.publish({
                            channel: 'upload',
                            topic: 'uploadPhotoSuccess',
                            data: {}
                        });
                        $scope.$destroy();
                    }
                });
            };

            $scope.upload = function () {
                if (!$scope.photo.name) {
                    return;
                }
                var formData = new FormData();
                var file = document.querySelector('input[type=file]').files[0];
                formData.append('file', file);
                formData.append('albumId', $scope.selectedAlbum._id);
                formData.append('name', $scope.photo.name);
                formData.append('description', $scope.photo.description);

                $http({
                    method: 'POST',
                    url: 'api/photo/upload',
                    data: formData,
                    headers: {'Content-Type': undefined}
                }).then(function (data) {
                    CommonUtils.showAlertMessage({
                        type: 'success',
                        message: '图片上传成功'
                    });
                    postal.publish({
                        channel: 'upload',
                        topic: 'uploadPhotoSuccess',
                        data: {}
                    });
                    $scope.$destroy();
                });
            };

            $scope.cancel = function () {
                $scope.$destroy();
            };
        }],
        link: function(scope, element, attrs, ngModel) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});

photoModule.directive('showPhotoPopover', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/photo/show_photo.html',
        controller: ['$scope', function ($scope) {
            $scope.currentPhotoIndex = _.findIndex($scope.album.photos, {_id: $scope.photo._id});

            $scope.lastPhoto = function () {
                if ($scope.currentPhotoIndex > 0) {
                    $scope.currentPhotoIndex--;
                    $scope.photo = $scope.album.photos[$scope.currentPhotoIndex];
                }
            };

            $scope.nextPhoto = function () {
                if ($scope.currentPhotoIndex < $scope.album.photos.length - 1) {
                    $scope.currentPhotoIndex++;
                    $scope.photo = $scope.album.photos[$scope.currentPhotoIndex];
                }
            };

            $scope.cancel = function () {
                $scope.$destroy();
            };
        }],
        link: function (scope, element, attrs, ngModel) {
            element.width(document.body.clientHeight * 1.8);
            window.onresize = function (event) {
                console.log(document.body.clientWidth, document.body.clientHeight);
                console.log(element);
                element.width(document.body.clientHeight * 1.8);
            };
            scope.$on('$destroy', function () {
                element.remove();
                $('.photo-popover-mark').remove();
            });
        }
    };
});
