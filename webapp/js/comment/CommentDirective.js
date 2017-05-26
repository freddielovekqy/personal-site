/**
 * Created by freddie on 2017/5/13.
 */
commentModule.directive('commentDirective', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        scope: {
            userInfo: '=',
            objectInfo: '=',
            currentUser: '='
        },
        replace: true,
        templateUrl: 'views/tlps/comment/comment_directive.html',
        controller: ['$scope', 'HttpService', 'CommonUtils', 'MessagePopoverUtil', function ($scope, HttpService, CommonUtils, MessagePopoverUtil) {
            $scope.option = {
                id: 'replyAtOnce',
                name: 'replyAtOnce',
                label: '同时转发到我的微博',
                checked: false,
                disabled: false
            };

            $scope.comment = {
                content: '',
                type: 'simpleBlog'
            };

            $scope.replyCommentOption = {
                id: 'replyCommentAtOnce',
                name: 'replyCommentAtOnce',
                label: '同时转发到我的微博',
                checked: false,
                disabled: false
            };

            $scope.replyComment = {
                replyCommentId: '',
                replyUserName: '',
                content: '',
                type: 'simpleBlog'
            };

            $scope.addReplyCommentForReplyComment = '';

            findComments();

            $scope.deleteComment = function (comment) {
                MessagePopoverUtil.createMessagePopover($scope, {
                    message: `确认删除该条评论？`,
                    type: 'confirm',
                    buttons: [
                        {
                            id: 'ok',
                            label: '确定',
                            callback: () => {
                                HttpService.delete({
                                    url: `api/comment/${comment._id}`,
                                    success: data => {
                                        CommonUtils.showAlertMessage({
                                            type: 'success',
                                            message: '删除成功'
                                        });
                                        findComments();
                                    }
                                });
                            }
                        }, {
                            id: 'cancel',
                            label: '取消'
                        }
                    ]
                });
            };

            $scope.addComment = function (comment) {
                if (comment.replyCommentId) {
                    comment.content = comment.content.replace(`回复@${comment.replyUserName}:`, '');
                }
                HttpService.post({
                    url: 'api/comment',
                    params: {
                        objectId: $scope.objectInfo._id,
                        comment: comment
                    },
                    success: data => {
                        CommonUtils.showAlertMessage({
                            type: 'success',
                            message: '评论成功'
                        });
                        $scope.replyComment = {
                            replyCommentId: '',
                            replyUserId: '',
                            replyUserName: '',
                            content: '',
                            type: 'simpleBlog'
                        };
                        $scope.comment = {
                            content: '',
                            type: 'simpleBlog'
                        };
                        $scope.addReplyCommentForReplyComment = '';
                        findComments();
                    }
                });
            };

            $scope.cancelAddComment = function () {
                $scope.replyComment = {
                    replyCommentId: '',
                    replyUserId: '',
                    replyUserName: '',
                    content: '',
                    type: 'simpleBlog'
                };
                $scope.addReplyCommentForReplyComment = '';
            };

            $scope.addReplyComment = function (comment, userInfo, replyCommentId) {
                if (($scope.replyComment.replyCommentId === comment._id && !$scope.addReplyCommentForReplyComment && !replyCommentId) ||
                    (replyCommentId && $scope.addReplyCommentForReplyComment === replyCommentId)) {

                    $scope.cancelAddComment();
                } else {
                    $scope.replyComment = {
                        replyCommentId: comment._id,
                        replyUserId: comment.userId,
                        replyUserName: userInfo.username,
                        content: `回复@${userInfo.username}:`,
                        type: 'simpleBlog'
                    };
                    $scope.addReplyCommentForReplyComment = replyCommentId;
                }
            };

            function findComments() {
                HttpService.get({
                    url: `api/comment/simpleBlog/${$scope.objectInfo._id}`,
                    success: comments => {
                        $scope.comments = comments.map(comment => {
                            comment.createDate = new Date(comment.createDate).format('MM-dd hh:ss');
                            return comment;
                        });
                    }
                });
            }
        }],
        link: function(scope, element, attrs, ngModel) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});