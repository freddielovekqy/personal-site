/**
 * Created by freddie on 2017/3/20.
 */
var accountInfoProfileModule = angular.module('accountInfoProfile', []);

accountInfoProfileModule.controller('AccountInfoProfileController', ['$scope', '$timeout', 'HttpService', 'CommonUserUtils', 'CommonConstants',
    function ($scope, $timeout, HttpService, CommonUserUtils, CommonConstants) {
        var userInfoBack = {};
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
            $scope.edit = false;
        })();

        $scope.updateBaseInfo = function () {
            $scope.edit = false;
            userInfoBack.username = $scope.userInfo.username;
            userInfoBack.realName = $scope.userInfo.realName;
            userInfoBack.sex = $scope.userInfo.sex;
            userInfoBack.birthday = $scope.userInfo.birthday;
            userInfoBack.birthPlace = $scope.selectedProvince.label + '-' + $scope.selectedCity.label;
            userInfoBack.briefIntroduction = $scope.userInfo.briefIntroduction;
            HttpService.post({
                url: 'api/user/update',
                params: {
                    userInfo: userInfoBack
                },
                success: function (data) {
                    // 通知所有部件更新用户信息
                    postal.publish({
                        channel: 'user',
                        topic: 'updateUserInfo',
                        data: userInfoBack
                    });
                }
            });
        };

        $scope.editProfile = function () {
            $scope.edit = true;
        };

        $scope.cancelEdit = function () {
            $scope.edit = false;
        };

        function getUserInfo(data) {
            userInfoBack = angular.copy(data);
            $scope.userInfo = data;
            $scope.userInfo.createDate = new Date($scope.userInfo.createDate).format('yyyy-MM-dd');
            $scope.userInfo.birthday = new Date($scope.userInfo.birthday);

            var myCity = {
                province: $scope.userInfo.birthPlace.split('-')[0],
                city: $scope.userInfo.birthPlace.split('-')[1]
            };
            $scope.chinaCities = CommonConstants.CHINA_CITY;
            $scope.selectedProvince = $scope.chinaCities[_.findIndex($scope.chinaCities, {label: myCity.province})];
            $scope.selectedCity = $scope.selectedProvince.cities[_.findIndex($scope.selectedProvince.cities, {label: myCity.city})];
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