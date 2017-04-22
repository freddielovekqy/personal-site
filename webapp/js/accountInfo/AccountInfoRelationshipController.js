/**
 * Created by freddie on 2017/4/15.
 */
var relationshipModule = angular.module('accountInfoRelationship', []);

relationshipModule.controller('AccountInfoRelationshipController', ['$scope', '$timeout', 'HttpService', 'CommonUserUtils',
    function ($scope, $timeout, HttpService, CommonUserUtils) {

        (function () {
            getAttentionUsers($scope.currentUserId);
        })();

        function getAttentionUsers(userId) {
            if (userId) {
                HttpService.get({
                    url: 'api/relationship/' + userId + '/attentions',
                    success: data => {
                        $scope.userAttentionInfos = data;
                    }
                })
            }
        }
    }
]);

relationshipModule.directive('accountInfoRelationship', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        scope: {
            currentUserId: '@'
        },
        replace: true,
        templateUrl: 'views/tlps/accountInfo/relationship.html',
        controller: 'AccountInfoRelationshipController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});