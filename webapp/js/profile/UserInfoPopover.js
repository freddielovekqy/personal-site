/**
 * Created by freddie on 2017/5/14.
 */
profileModule.directive('userInfoPopover', function () {
    return {
        restrict : 'E',
        replace : true,
        templateUrl: 'views/tlps/profile/user_info_popover.html',
        controller: ['$scope', 'HttpService', 'CommonUtils', 'CommonUserUtils', function ($scope, HttpService, CommonUtils, CommonUserUtils) {
            var showOrHideFlag = true;
            var leaveTarget = false;
            var currentUserInfo = {};

            (function () {
                currentUserInfo = CommonUserUtils.getCurrentUserInfo();
                getAttentions(currentUserInfo._id);
            })();
            $scope.showOrHide = function (showOrHide) {
                showOrHideFlag = showOrHide;

                if (leaveTarget && !showOrHideFlag) {
                    $scope.$destroy();
                }
            };

            $scope.privateChat = function () {
                postal.publish({
                    channel: 'communication',
                    topic: 'chatToOther',
                    data: $scope.userInfo
                });
                $scope.$destroy();
            };

            $scope.addAttention = function () {
                HttpService.post({
                    url: 'api/relationship',
                    params: {
                        targetUserId: $scope.userInfo._id,
                        attentionType: '朋友圈' // TODO 关注分组功能暂未开放
                    },
                    success: data => {
                        CommonUtils.showAlertMessage({
                            type: 'success',
                            message: '关注成功'
                        });
                        $scope.$destroy();
                    }
                });
            };

            $scope.deleteAttentions = function () {
                HttpService.delete({
                    url: `api/relationship/attention/${$scope.userInfo._id}`,
                    success: data => {
                        CommonUtils.showAlertMessage({
                            type: 'success',
                            message: '取消关注成功'
                        });
                        $scope.$destroy();
                    }
                });
            };

            function getAttentions(userId) {
                HttpService.get({
                    url: `api/relationship/${userId}/attentions`,
                    success: users => {
                        $scope.attentionUsers = users;
                        var index = _.findIndex($scope.attentionUsers, {_id: $scope.userInfo._id});
                        if (index > -1) {
                            var attention = $scope.attentionUsers[index];
                            $scope.userInfo.attentionInfo = {
                                type: attention.typeName
                            };
                        } else {
                            $scope.userInfo.attentionInfo = {};
                        }
                    }
                });
            }

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