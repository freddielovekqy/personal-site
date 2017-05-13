/**
 * Created by freddie on 2017/4/9.
 */
var simpleBlogInfoModule = angular.module('simpleBlogInfo', []);

simpleBlogInfoModule.controller('SimpleBlogInfoController', ['$scope', '$timeout', 'HttpService', 'CommonUtils', 'MessagePopoverUtil',
    function ($scope, $timeout, HttpService, CommonUtils, MessagePopoverUtil) {

        //$scope.blogInfo = {
        //    userId: '',
        //    userName: '柯沁怡',
        //    userImage: 'image/users/58426f4f482bc73140d93211/head.jpg',
        //    createDate: new Date().format('yyyy-MM-dd hh:mm'),
        //    source: '荣耀6',
        //    content: '瞬间感觉整个人智商都提高了',
        //    isCurrentUser: false,
        //    isHaveCollected: true,
        //    isHaveFavor: true,
        //    replyNum: 0,
        //    commentsNum: 0,
        //    goodNum: 1,
        //    originBlogInfo: {
        //        userId: '',
        //        userName: '史蒂芬霍金',
        //        userImage: '',
        //        content: 'Greetings to my friends in China! It has been too long! I last visited China in 2006 when ' +
        //        'I took part in a physics conference in Beijing. It was an extraordinary experience. My first trip was in 1985 when I travelled across your rem',
        //        createDate: new Date().format('yyyy-MM-dd hh:mm'),
        //        isHaveFavor: true,
        //        source: '荣耀6',
        //        replyNum: 0,
        //        commentsNum: 0,
        //        goodNum: 1
        //    }
        //};
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