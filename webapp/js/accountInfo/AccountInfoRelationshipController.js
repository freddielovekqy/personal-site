/**
 * Created by freddie on 2017/4/15.
 */
var relationshipModule = angular.module('accountInfoRelationship', []);

relationshipModule.controller('AccountInfoRelationshipController', ['$scope', '$timeout', '$location', 'HttpService', 'CommonUserUtils',
    function ($scope, $timeout, $location, HttpService, CommonUserUtils) {

        console.log($location);

        $scope.showAllAttentions = function () {
            $location.url('/account-info/relationship#attentions');
        };

        $scope.changeShowAttentions = function (typeIndex) {
            $location.url('/account-info/relationship#' + typeIndex);
        };

        (function () {
            $scope.currentShowTab = $location.$$hash;
            getAttentionUsers($scope.currentUserId);
            getAttentionCountByTypes($scope.currentUserId);
        })();

        function getAttentionCountByTypes(userId) {
            if (userId) {
                HttpService.get({
                    url: 'api/relationship/' + userId + '/attentions/types',
                    success: data => {
                        $scope.attentionTypesCount = data;
                        $scope.attentionTypesCount.typeGroupCount.forEach(typeCount => {
                            switch (typeCount.typeName) {
                                case '特别关注':
                                    typeCount.typeIndex = 'special-attention';
                                    typeCount.className = 'fa-heartbeat';
                                    break;
                                case '朋友圈':
                                    typeCount.typeIndex = 'friends';
                                    typeCount.className = 'fa-heart';
                                    break;
                                case '兴趣爱好':
                                    typeCount.typeIndex = 'interest';
                                    typeCount.className = 'fa-star-o';
                                    break;
                                default:
                                    typeCount.typeIndex = 'no-type';
                                    typeCount.className = 'fa-circle fa-';
                                    break;
                            }
                        });
                    }
                })
            }
        }

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