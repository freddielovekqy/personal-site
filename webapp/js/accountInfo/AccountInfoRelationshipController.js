/**
 * Created by freddie on 2017/4/15.
 */
var relationshipModule = angular.module('accountInfoRelationship', []);

relationshipModule.service('RelationshipService', function () {
    var attentions = [];
    function setCurrentUserAttentions(attentionList) {
        attentions = attentionList;
    }
    function getCurrentUserAttentions() {
        return attentions;
    }
    return {
        setCurrentUserAttentions: setCurrentUserAttentions,
        getCurrentUserAttentions: getCurrentUserAttentions
    };
});

relationshipModule.controller('AccountInfoRelationshipController', ['$scope', '$timeout', '$location', 'HttpService', 'RelationshipService',
    function ($scope, $timeout, $location, HttpService, RelationshipService) {

        $scope.currentShowTab = 'attentions';

        $scope.showAllAttentions = function () {
            $scope.currentShowTab = 'attentions';
            getAttentions($scope.currentUserId);
        };

        $scope.showAllFans = function () {
            $scope.currentShowTab = 'fans';

        };

        $scope.changeShowAttentions = function (typeIndex) {
            $location.url('/account-info/relationship#' + typeIndex);
        };

        (function () {
            getAttentions($scope.currentUserId);
            getFans($scope.currentUserId);
            //getAttentionCountByTypes($scope.currentUserId);
        })();

        //function getAttentionCountByTypes(userId) {
        //    if (userId) {
        //        HttpService.get({
        //            url: 'api/relationship/' + userId + '/attentions/types',
        //            success: data => {
        //                $scope.attentionTypesCount = data;
        //                $scope.attentionTypesCount.typeGroupCount.forEach(typeCount => {
        //                    switch (typeCount.typeName) {
        //                        case '特别关注':
        //                            typeCount.typeIndex = 'special-attention';
        //                            typeCount.className = 'fa-heartbeat';
        //                            break;
        //                        case '朋友圈':
        //                            typeCount.typeIndex = 'friends';
        //                            typeCount.className = 'fa-heart';
        //                            break;
        //                        case '兴趣爱好':
        //                            typeCount.typeIndex = 'interest';
        //                            typeCount.className = 'fa-star-o';
        //                            break;
        //                        default:
        //                            typeCount.typeIndex = 'no-type';
        //                            typeCount.className = 'fa-circle fa-';
        //                            break;
        //                    }
        //                });
        //            }
        //        })
        //    }
        //}

        function getAttentions(userId) {
            if (userId) {
                HttpService.get({
                    url: 'api/relationship/' + userId + '/attentions',
                    success: data => {
                        $scope.attentions = data;
                        RelationshipService.setCurrentUserAttentions($scope.attentions);
                    }
                })
            }
        }

        function getFans(userId) {
            if (userId) {
                HttpService.get({
                    url: 'api/relationship/' + userId + '/fans',
                    success: data => {
                        $scope.fans = data;
                    }
                })
            }
        }

        var updateAttentionsSub = postal.subscribe({
            channel: 'accountInfo',
            topic: 'updateAttentions',
            callback: data => {
                getAttentions($scope.currentUserId);
            }
        });

        $scope.$on('$destroy', () => {
            updateAttentionsSub && updateAttentionsSub.unsubscribe();
        });
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