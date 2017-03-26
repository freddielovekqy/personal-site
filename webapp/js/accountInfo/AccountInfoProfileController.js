/**
 * Created by freddie on 2017/3/20.
 */
var accountInfoProfileModule = angular.module('accountInfoProfile', []);

accountInfoProfileModule.controller('AccountInfoProfileController', ['$scope', '$timeout', 'CommonUserUtils',
    function ($scope, $timeout, CommonUserUtils) {

        (function () {
            var result = CommonUserUtils.getCurrentUserInfo();
            if (result instanceof Promise) {
                result.then((data) => {
                    $timeout(() => {
                        getUserInfo(data);
                    }, 0);
                });
            } else {
                getUserInfo(data);
            }
        })();
        $scope.edit = false;

        $scope.editProfile = function () {
            $scope.edit = true;
        };

        $scope.updateProfile = function () {
            $scope.edit = false;
        };

        $scope.cancelEdit = function () {
            $scope.edit = false;
        };

        function getUserInfo(data) {
            $scope.userInfo = data;
            $scope.userInfo.createDate = new Date($scope.userInfo.createDate).format('yyyy-MM-dd');
            $scope.userInfo.birthday = new Date($scope.userInfo.birthday).format('yyyy-MM-dd');
        }
    }
]);

accountInfoProfileModule.directive('accountInfoProfile', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/accountInfo/profile.html',
        controller: 'AccountInfoProfileController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});