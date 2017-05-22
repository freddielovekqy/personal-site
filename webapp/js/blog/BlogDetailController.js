/**
 * Created by freddie on 2017/2/8.
 */
var blogDetailModule = angular.module('blogDetail', []);

blogDetailModule.controller('BlogDetailController', ['$scope', '$sce', 'HttpService', '$routeParams', '$location', 'BlogService',
    function ($scope, $sce, HttpService, $routeParams, $location, BlogService) {
        var blogId = $routeParams.blogId;
        $scope.comments = [];
        $scope.newComment = {
            content: '',
            type: 'blog'
        };

        (function () {
            getBlogInfo(blogId);
            getBlogCommentsInfo(blogId);
        })();

        $scope.editBlog = function () {
            $location.path('/blog/edit/' + $scope.blogInfo._id);
        };

        $scope.addComment = function () {
            $scope.newComment.floor = _.maxBy($scope.comments, 'floor') + 1;
            HttpService.post({
                url: 'api/comment',
                params: {
                    objectId: blogId,
                    comment: $scope.newComment
                },
                success: data => {
                    getBlogCommentsInfo(blogId);
                    postal.publish({
                        channel: 'wangEditor',
                        topic: 'emptyContent',
                        data: {}
                    });
                    $scope.newComment = {
                        content: '',
                        type: 'blog'
                    };
                }
            });
        };

        $scope.deleteComment = function (commentId) {
            HttpService.delete({
                url: 'api/comment/' + commentId,
                success: data => {
                    getBlogCommentsInfo(blogId);
                }
            });
        };

        $scope.removeBlog = function () {
            HttpService.delete({
                url: 'api/blog/' + $scope.blogInfo._id,
                success: function (data) {
                    $location.path('/blog');
                }
            });
        };

        function getBlogInfo(blogId) {
            HttpService.get({
                url: 'api/blog?blogId=' + blogId,
                success: function (data) {
                    data.createDate = new Date(data.createDate).format('yyyy-MM-dd hh:mm:ss');
                    data.lastUpdateDate = new Date(data.lastUpdateDate).format('yyyy-MM-dd hh:mm:ss');
                    $scope.blogInfo = BlogService.getBlogType(data);
                    $scope.blogInfo.content = $sce.trustAsHtml($scope.blogInfo.content);
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

        function getBlogCommentsInfo(blogId) {
            HttpService.get({
                url: 'api/comment/blog/' + blogId,
                success: data => {
                    $scope.comments = data.map(comment => {
                        comment.content = $sce.trustAsHtml(comment.content);
                        comment.createDate = new Date(comment.createDate).format('yyyy-MM-dd hh:mm:ss');
                        comment.replyComments = comment.replyComments.map(replyComment => {
                            replyComment.content = $sce.trustAsHtml(replyComment.content);
                            replyComment.createDate = new Date(replyComment.createDate).format('yyyy-MM-dd hh:mm:ss');
                            return replyComment;
                        });
                        return comment;
                    });
                }
            });
        }


    }
]);