/**
 * Created by freddie on 2017/5/14.
 */
profileModule.directive('userInfoPopover', function () {
    return {
        restrict : 'E',
        replace : true,
        templateUrl: 'views/tlps/profile/user_info_popover.html',
        controller: ['$scope', function ($scope) {
            var showOrHideFlag = true;
            var leaveTarget = false;
            $scope.showOrHide = function (showOrHide) {
                showOrHideFlag = showOrHide;

                if (leaveTarget && !showOrHideFlag) {
                    $scope.$destroy();
                }
            };

            var closePopoverSub = postal.subscribe({
                channel: 'userInfoPopover',
                topic: 'closePopover',
                callback: data => {
                    leaveTarget = true;
                }
            });

            $scope.$on('$destroy', () => {
                closePopoverSub && closePopoverSub.unsubscribe()
            });
        }],
        link: function (scope, element, attrs) {
            var position = scope.position;
            var targetOffset = scope.targetOffset;
            scope.positionStype = {
                left: position.x - 170 + 'px'
            };

            if (position.y < 200) {
                scope.positionStype.top = targetOffset.top + 20 + 'px';
            } else {
                scope.positionStype.top = targetOffset.top - 200 - 10 + 'px';
            }
            scope.$on('$destroy', () => {
                element.remove();
            });
        }
    };
});