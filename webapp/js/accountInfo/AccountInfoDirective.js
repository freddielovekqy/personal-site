/**
 * Created by freddie on 2017/4/16.
 */
accountInfoModule.directive('accountInfoAttentionUser', function () {
    return {
        restrict: 'E',
        scope: {
            attentionUser: '='
        },
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/accountInfo/attention_user_item.html',
        controller: ['$scope', function ($scope) {
            console.log($scope.attentionUser);
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