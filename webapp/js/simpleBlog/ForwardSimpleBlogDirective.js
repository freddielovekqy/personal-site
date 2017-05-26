/**
 * Created by freddie on 2017/5/13.
 */
simpleBlogModule.directive('forwardSimpleBlog', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        //scope: {
        //    originSimpleBlog: '='
        //},
        replace: true,
        templateUrl: 'views/tlps/simpleBlog/forward_simple_blog.html',
        controller: ['$scope', '$timeout', 'HttpService', 'CommonUtils', function ($scope, $timeout, HttpService, CommonUtils) {
            $scope.addCommentToOriginOptions = {
                id: 'addCommentToOrigin',
                name: 'addCommentToOrigin',
                label: `同时评论给${$scope.originSimpleBlog.userInfo.username}`,
                checked: false,
                disabled: false
            };
            $scope.showJurisdictionsFlag = false;

            $scope.showJurisdictionOptions = function () {
                $scope.showJurisdictionsFlag = !$scope.showJurisdictionsFlag;
            };

            $scope.changeJurisdiction = function (jurisdiction) {
                $scope.simpleBlog.jurisdiction = jurisdiction;
            };

            $scope.addForwardSimpleBlog = function () {
                var promises = [addForwardSimpleBlog()];
                if ($scope.addCommentToOriginOptions.checked) {
                    promises.push(addComment());
                }
                Promise.all(promises)
                    .then(data => {
                        CommonUtils.showAlertMessage({
                            type: 'success',
                            message: '转发微博成功'
                        });
                        $scope.$destroy();
                        postal.publish({
                            channel: 'homePage',
                            topic: 'refreshHomeContent',
                            data: {}
                        });
                    });
            };

            $scope.cancelPopover = function () {
                $scope.$destroy();
            };

            function addForwardSimpleBlog() {
                return new Promise((resolve, reject) => {
                    HttpService.post({
                        url: 'api/simpleBlog',
                        params: {
                            simpleBlog: $scope.simpleBlog
                        },
                        success: data => {
                            resolve(data);
                        },
                        error: error => {
                            reject(error);
                        }
                    });
                });
            }

            function addComment() {
                return new Promise((resolve, reject) => {
                    HttpService.post({
                        url: 'api/comment',
                        params: {
                            objectId: $scope.originSimpleBlog._id,
                            comment: {
                                content: $scope.simpleBlog.content,
                                type: 'simpleBlog'
                            }
                        },
                        success: data => {
                            resolve(data);
                        },
                        error: error => {
                            reject(error);
                        }
                    });
                });
            }

            var hideOptionsSub = postal.subscribe({
                channel: 'homePage',
                topic: 'hideAllJurisdictionOptions',
                callback: () => {
                    $scope.showJurisdictionsFlag = false;
                }
            });

            $scope.$on('$destroy', () => {
                hideOptionsSub && hideOptionsSub.unsubscribe();
            });
        }],
        link: function(scope, element, attrs, ngModel) {
            setTimeout(() => {
                element.find('textarea').focus();
            }, 200);
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});