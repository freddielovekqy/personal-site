/**
 * Created by freddie on 2017/1/9.
 */
var accountModule = angular.module('account-setting', ['account-profile']);

accountModule.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/account-setting/profile", {
        templateUrl: '/views/tlps/accountSetting/account-profile.html',
        controller: 'AccountProfileController'
    });
}]);

accountModule.controller('AccountSettingController', ['', function () {
    console.log('account setting...')
}]);