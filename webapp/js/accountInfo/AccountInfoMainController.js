/**
 * Created by freddie on 2017/3/11.
 */
var accountInfoMainModule = angular.module('accountInfoMain', []);

accountInfoMainModule.controller('AccountInfoMainPageController', ['$scope',
    function ($scope) {

    }
]);

accountInfoMainModule.directive('accountInfoMainPage', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/accountInfo/main_page.html',
        controller: 'AccountInfoMainPageController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});