/**
 * Created by freddie on 2017/3/20.
 */
var accountInfoProfileModule = angular.module('accountInfoProfile', []);

accountInfoProfileModule.controller('AccountInfoProfileController', ['$scope', '$timeout', 'HttpService', 'CommonUserUtils', 'CommonConstants',
    function ($scope, $timeout, HttpService, CommonUserUtils, CommonConstants) {
        var userInfoBack = {};
        (function () {
            getUserInfo();
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
                    CommonUserUtils.updateCurrentUserInfo();
                }
            });
        };

        $scope.editProfile = function () {
            $scope.edit = true;
        };

        $scope.cancelEdit = function () {
            $scope.edit = false;
        };

        function getUserInfo() {
            var result = CommonUserUtils.getCurrentUserInfo();
            if (result && result instanceof Promise) {
                result.then((data) => {
                    $timeout(() => {
                        setUserInfo(data);
                    }, 0);
                });
            } else if (result) {
                setUserInfo(result);
            }
        }

        function setUserInfo(data) {
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

        var updateUserInfoSub = postal.subscribe({
            channel: 'user',
            topic: 'updateUserInfo',
            callback: data => {
                getUserInfo();
            }
        });

        $scope.$on('destroy', () => {
            updateUserInfoSub.unsubscribe();
        });
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