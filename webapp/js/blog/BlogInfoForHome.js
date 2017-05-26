/**
 * Created by freddie on 2017/5/21.
 */
blogModule.controller('BlogInfoForHomeController', ['$scope', '$compile',
    function ($scope, $compile) {
        $scope.content.createDate = new Date($scope.content.createDate).format('yyyy-MM-dd hh:mm');

        $scope.showOrHideUserInfoPopover = function (showOrHide, event) {
            if (showOrHide) {
                var baseEle = $('.popover-container');
                var newScope = $scope.$new();
                newScope.position = {
                    x: event.clientX,
                    y: event.clientY
                };
                newScope.targetOffset = $(event.target).offset();
                newScope.userInfo = $scope.content.userInfo;
                var ele = $compile('<user-info-popover></user-info-popover>')(newScope);
                baseEle.append(ele);
            } else {
                postal.publish({
                    channel: 'userInfoPopover',
                    topic: 'closePopover',
                    data: {}
                });
            }
        };
    }
]);
blogModule.directive('blogInfoForHome', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        scope: {
            content: '=',
            currentUser: '='
        },
        replace: true,
        templateUrl: 'views/tlps/blog/blog_info_for_home.html',
        controller: 'BlogInfoForHomeController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});