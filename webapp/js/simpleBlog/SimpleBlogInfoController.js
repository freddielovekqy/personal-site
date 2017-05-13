/**
 * Created by freddie on 2017/4/9.
 */
var simpleBlogInfoModule = angular.module('simpleBlogInfo', []);

simpleBlogInfoModule.controller('SimpleBlogInfoController', ['$scope', '$timeout', 'HttpService', 'CommonUtils', 'MessagePopoverUtil',
    function ($scope, $timeout, HttpService, CommonUtils, MessagePopoverUtil) {
        $scope.showOperationsFlag = false;
        $scope.content.createDate = new Date($scope.content.createDate).format('yyyy-MM-dd hh:mm');

        $scope.showOperations = function () {
            $scope.showOperationsFlag = true;
        };

        $scope.deleteContent = function () {
            MessagePopoverUtil.createMessagePopover($scope, {
                message: '确认删除这条内容？',
                type: 'confirm',
                buttons: [
                    {
                        id: 'ok',
                        label: '确定',
                        callback: () => {
                            deleteContent();
                        }
                    }, {
                        id: 'cancel',
                        label: '取消'
                    }
                ]
            });
        };

        $scope.updateJurisdiction = function (jurisdiction) {
            HttpService.put({
                url: 'api/simpleBlog/jurisdiction',
                params: {
                    simpleBlogId: $scope.content._id,
                    jurisdiction: jurisdiction
                },
                success: data => {
                    CommonUtils.showAlertMessage({
                        type: 'success',
                        message: '更新成功'
                    });
                    postal.publish({
                        channel: 'homePage',
                        topic: 'refreshHomeContent',
                        data: {}
                    });
                }
            });
        };

        $scope.shieldContent = function () {
            MessagePopoverUtil.createMessagePopover($scope, {
                message: '确认屏蔽这条内容？',
                type: 'confirm',
                buttons: [
                    {
                        id: 'ok',
                        label: '确定',
                        callback: () => {
                            shieldContent();
                        }
                    }, {
                        id: 'cancel',
                        label: '取消'
                    }
                ]
            });
        };

        $scope.shieldUser = function () {
            MessagePopoverUtil.createMessagePopover($scope, {
                message: `确认在首页不看 ${$scope.content.userInfo.username} 的内容？`,
                type: 'confirm',
                buttons: [
                    {
                        id: 'ok',
                        label: '确定',
                        callback: () => {
                            shieldUser();
                        }
                    }, {
                        id: 'cancel',
                        label: '取消'
                    }
                ]
            });
        };

        $scope.removeAttention = function () {
            MessagePopoverUtil.createMessagePopover($scope, {
                message: `确认取消关注 ${$scope.content.userInfo.username} ？`,
                type: 'confirm',
                buttons: [
                    {
                        id: 'ok',
                        label: '确定',
                        callback: () => {
                            removeAttention();
                        }
                    }, {
                        id: 'cancel',
                        label: '取消'
                    }
                ]
            });
        };

        $scope.showCommentFlag = false;
        $scope.showComments = function () {
            $scope.showCommentFlag = !$scope.showCommentFlag;
        };

        function removeAttention() {
            HttpService.delete({
                url: `api/relationship/attention/${$scope.content.userId}`,
                success: data => {
                    postal.publish({
                        channel: 'homePage',
                        topic: 'refreshHomeContent',
                        data: {}
                    });
                }
            });
        }

        function shieldUser() {
            postal.publish({
                channel: 'homePage',
                topic: 'shieldUser',
                data: {
                    userId: $scope.content.userId
                }
            });
        }

        function shieldContent() {
            postal.publish({
                channel: 'homePage',
                topic: 'shieldContent',
                data: {
                    contentId: $scope.content._id
                }
            });
        }

        function deleteContent() {
            HttpService.delete({
                url: 'api/simpleBlog/' + $scope.content._id,
                success: data => {
                    CommonUtils.showAlertMessage({
                        type: 'success',
                        message: '删除成功'
                    });
                    postal.publish({
                        channel: 'homePage',
                        topic: 'refreshHomeContent',
                        data: {}
                    });
                }
            });
        }

        var hideOperationsSub = postal.subscribe({
            channel: 'homePage',
            topic: 'hideAllOperations',
            callback: data => {
                $timeout(() => {
                    $scope.showOperationsFlag = false;
                }, 0);
            }
        });

        $scope.$on('$destroy', function () {
            hideOperationsSub && hideOperationsSub.unsubscribe();
        });
    }
]);

simpleBlogInfoModule.directive('simpleBlogInfo', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        scope: {
            content: '=',
            currentUser: '='
        },
        replace: true,
        templateUrl: 'views/tlps/simpleBlog/simple_blog_info.html',
        controller: 'SimpleBlogInfoController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});