/**
 * Created by freddie on 2017/3/20.
 */
var accountInfoProfileModule = angular.module('accountInfoProfile', []);

accountInfoProfileModule.controller('AccountInfoProfileController', ['$scope', '$timeout', 'HttpService', 'CommonUserUtils', 'CommonConstants',
    function ($scope, $timeout, HttpService, CommonUserUtils, CommonConstants) {
        var userInfoBack = {};
        $scope.chinaCities = CommonConstants.CHINA_CITY;
        $scope.constellations = CommonConstants.CONSTELLATIONS;
        $scope.bloods = CommonConstants.BLOOD_TYPES;
        $scope.relationshipStatuses = CommonConstants.RELATIONSHIP_STATUS;
        $scope.schoolTypes = CommonConstants.SCHOOL_TYPES;
        $scope.years = [];
        for (var i = new Date().getFullYear(); i > 1990; i--) {
            $scope.years.push(i);
        }

        $scope.currentShowInfo = 'basicInfo';
        $scope.editedEducation = {};
        $scope.editedWork = {};
        $scope.educations = [];
        $scope.works = [];

        $scope.editEducationFlag = false;
        $scope.editWorkFlag = false;
        $scope.edit = false;

        (function () {
            getUserInfo();
            $scope.edit = false;
        })();

        $scope.changeInfoType = function (showInfoType) {
            $scope.currentShowInfo = showInfoType;
        };

        $scope.updateBaseInfo = function () {
            $scope.edit = false;
            userInfoBack.username = $scope.userInfo.username;
            userInfoBack.realName = $scope.userInfo.realName;
            userInfoBack.sex = $scope.userInfo.sex;
            userInfoBack.birthday = $scope.userInfo.birthday;
            userInfoBack.birthPlace = $scope.selectedProvince.label + '-' + $scope.selectedCity.label;
            userInfoBack.briefIntroduction = $scope.userInfo.briefIntroduction;
            updateUserInfo();
        };

        $scope.updateDetailInfo = function () {
            $scope.edit = false;
            userInfoBack.relationshipStatus = $scope.userInfo.relationshipStatus;
            userInfoBack.livePlace = $scope.selectedLiveProvince.label + '-' + $scope.selectedLiveCity.label;
            userInfoBack.blood = $scope.userInfo.blood;
            userInfoBack.constellation = $scope.selectedConstellation.label;
            userInfoBack.phoneNumber = $scope.userInfo.phoneNumber;
            userInfoBack.otherEmail = $scope.userInfo.otherEmail;
            userInfoBack.QQ = $scope.userInfo.QQ;
            userInfoBack.personalWebsite = $scope.userInfo.personalWebsite;
            updateUserInfo();
        };

        $scope.updateHobbyInfo = function () {
            $scope.edit = false;
            userInfoBack.hobby = $scope.userInfo.hobby;
            updateUserInfo();
        };

        $scope.confirmEducation = function () {
            $scope.editEducationFlag = false;
            HttpService.post({
                url: 'api/user/education',
                params: {
                    userId: $scope.userInfo._id,
                    educationInfo: $scope.editedEducation
                },
                success: function (data) {
                    $scope.editedEducation = {};
                    CommonUserUtils.updateCurrentUserInfo();
                }
            });
        };

        $scope.confirmWork = function () {
            $scope.editWorkFlag = false;
            HttpService.post({
                url: 'api/user/work',
                params: {
                    userId: $scope.userInfo._id,
                    workInfo: $scope.editedWork
                },
                success: function (data) {
                    $scope.editedWork = {};
                    CommonUserUtils.updateCurrentUserInfo();
                }
            });
        };

        $scope.editWork = function (work = {}) {
            $scope.editedWork = angular.copy(work);
            $scope.editWorkFlag = true;
        };

        $scope.editEducation = function (education = {}) {
            $scope.editedEducation = angular.copy(education);
            $scope.editEducationFlag = true;
        };

        $scope.editProfile = function () {
            $scope.edit = true;
        };

        $scope.cancelEdit = function () {
            $scope.edit = false;
            $scope.editWorkFlag = false;
            $scope.editEducationFlag = false;
            $scope.editedEducation = {};
            $scope.editedWork = {};
        };

        $scope.changeRelationShip = function (relationship) {
            $scope.userInfo.relationshipStatus = relationship;
        };

        $scope.changeBlood = function (blood) {
            $scope.userInfo.blood = blood;
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

        function updateUserInfo() {
            HttpService.post({
                url: 'api/user/update',
                params: {
                    userInfo: userInfoBack
                },
                success: function (data) {
                    CommonUserUtils.updateCurrentUserInfo();
                }
            });
        }

        function setUserInfo(data) {
            userInfoBack = angular.copy(data);
            $scope.userInfo = data;
            $scope.userInfo.createDate = new Date($scope.userInfo.createDate).format('yyyy-MM-dd');
            $scope.userInfo.birthday = new Date($scope.userInfo.birthday);

            $scope.educations = $scope.userInfo.educations;

            if ($scope.userInfo.birthPlace) {
                var myCity = {
                    province: $scope.userInfo.birthPlace.split('-')[0],
                    city: $scope.userInfo.birthPlace.split('-')[1]
                };
                $scope.selectedProvince = $scope.chinaCities[_.findIndex($scope.chinaCities, {label: myCity.province})];
                $scope.selectedCity = $scope.selectedProvince.cities[_.findIndex($scope.selectedProvince.cities, {label: myCity.city})];
            }

            if ($scope.userInfo.livePlace) {
                var livePlace = {
                    province: $scope.userInfo.livePlace.split('-')[0],
                    city: $scope.userInfo.livePlace.split('-')[1]
                };
                $scope.selectedLiveProvince = $scope.chinaCities[_.findIndex($scope.chinaCities, {label: livePlace.province})];
                $scope.selectedLiveCity = $scope.selectedLiveProvince.cities[_.findIndex($scope.selectedLiveProvince.cities, {label: livePlace.city})];
            }

            if ($scope.userInfo.constellation) {
                $scope.selectedConstellation = $scope.constellations[_.findIndex($scope.constellations, {value: $scope.userInfo.constellation})];
            }
        }

        var updateUserInfoSub = postal.subscribe({
            channel: 'user',
            topic: 'updateUserInfo',
            callback: () => {
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