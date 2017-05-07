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
        controller: ['$scope', 'HttpService', 'PhotoService', function ($scope, HttpService, PhotoService) {

            $scope.albums = PhotoService.getAlbums();
            $scope.selectedAlbum = $scope.albums[_.findIndex($scope.albums, {_id: $scope.albumId})];
            $scope.photo = {};

            $scope.save = function () {


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