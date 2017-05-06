/**
 * Created by freddie on 2017/5/6.
 */
photoModule.directive('editAlbumPopover', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/photo/edit_album.html',
        controller: ['$scope', 'HttpService', function ($scope, HttpService) {
            $scope.album = {};
            $scope.albumJurisdictions = [
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
            ];
            $scope.selectedJurisdiction = $scope.albumJurisdictions[0];
            $scope.save = function () {
                $scope.album.jurisdiction = $scope.selectedJurisdiction.value;
                HttpService.post({
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
                    }
                });
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