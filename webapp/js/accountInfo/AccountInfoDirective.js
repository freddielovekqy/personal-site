/**
 * Created by freddie on 2017/4/16.
 */
accountInfoModule.directive('accountInfoAttentionUser', function () {
    return {
        restrict: 'E',
        scope: {
            attentionUser: '='
        },
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/accountInfo/attention_user_item.html',
        controller: ['$scope', function ($scope) {
            console.log($scope.attentionUser);
        }],
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});