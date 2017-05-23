/**
 * Created by freddie on 2017/4/16.
 */
accountInfoModule.directive('accountInfoAttentionUser', function () {
    return {
        restrict: 'E',
        scope: {
            userInfo: '='
        },
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/accountInfo/attention_user_item.html',
        controller: ['$scope', 'HttpService', function ($scope, HttpService) {
            console.log($scope.userInfo);
            $scope.deleteAttention = function () {
                HttpService.delete({
                    url: `api/relationship/attention/${$scope.userInfo._id}`,
                    success: data => {
                        postal.publish({
                            channel: 'accountInfo',
                            topic: 'updateAttentions',
                            data: {}
                        });
                    }
                });
            };
        }],
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});

accountInfoModule.directive('accountInfoFan', function () {
    return {
        restrict: 'E',
        scope: {
            userInfo: '='
        },
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/accountInfo/fan_item.html',
        controller: ['$scope', 'HttpService', 'RelationshipService', function ($scope, HttpService, RelationshipService) {
            var currentUserAttentions = [];
            $scope.fanBeAttention = false;

            $scope.addAttention = function () {
                HttpService.post({
                    url: 'api/relationship',
                    params: {
                        targetUserId: $scope.userInfo._id,
                        attentionType: '朋友圈' // TODO 关注分组功能暂未开放
                    },
                    success: data => {
                        postal.publish({
                            channel: 'accountInfo',
                            topic: 'updateAttentions',
                            data: {}
                        });
                    }
                });
            };

            $scope.$watch(function () {
                return RelationshipService.getCurrentUserAttentions();
            }, function (newVal) {
                currentUserAttentions = newVal;

                if (_.findIndex(currentUserAttentions, {userId: $scope.userInfo._id}) > -1) {
                    $scope.fanBeAttention = true;
                } else {
                    $scope.fanBeAttention = false;
                }
            });
        }],
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});

accountInfoModule.directive('updatePassword', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/accountInfo/update_password.html',
        controller: ['$scope', 'HttpService', 'CommonUtils', function ($scope, HttpService, CommonUtils) {
            $scope.ttt = '11111111111';
            $scope.updatePassword = function () {
                if ($scope.rePassword !== $scope.newPassword) {
                    return;
                }
                if ($scope.oldPassword === $scope.newPassword) {
                    return;
                }
                HttpService.put({
                    url: 'api/user/password',
                    params: {
                        oldPassword: $scope.oldPassword,
                        newPassword: $scope.newPassword
                    },
                    success: data => {
                        CommonUtils.showAlertMessage({
                            type: 'success',
                            message: '更新密码成功'
                        });
                        $scope.$destroy();
                    }
                });
            };

            $scope.cancel = function () {
                $scope.$destroy();
            };
        }],
        link: function (scope, elements, attrs, ngModel) {
            scope.$on('$destroy', function () {
                elements.remove();
            });
        }
    };
});