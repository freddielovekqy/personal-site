/**
 * Created by freddie on 2017/3/20.
 */
var accountInfoProfileModule = angular.module('accountInfoProfile', []);

accountInfoProfileModule.controller('AccountInfoProfileController', ['$scope',
    function ($scope) {

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