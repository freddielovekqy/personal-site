/**
 * Created by freddie on 2017/4/15.
 */
var relationshipModule = angular.module('accountInfoRelationship', []);

relationshipModule.controller('AccountInfoRelationshipController', [
    function () {

    }
]);

relationshipModule.directive('accountInfoRelationship', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/accountInfo/relationship.html',
        controller: 'AccountInfoRelationshipController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});