/**
 * Created by freddie on 2016/10/25.
 */
var blogListModule = angular.module('blogList', []);
blogListModule.constant('blogConstants', {
    BLOG_TYPES_ORIGINAL: '原创',
    BLOG_TYPES_ORIGINAL_SHOW: '原',
    BLOG_TYPES_REPRINT: '转载',
    BLOG_TYPES_REPRINT_SHOW: '转',
    BLOG_TYPES_TRANSLATION: '译文',
    BLOG_TYPES_TRANSLATION_SHOW: '译'
});
blogListModule.controller('BlogListController', ['$scope', '$location', 'HttpService', 'StorageUtils', 'blogConstants', '$routeParams',
    function ($scope, $location, HttpService, StorageUtils, blogConstants, $routeParams) {
        init();

        $scope.createBlog = function () {
            $location.path('/blog/create');
        };

        $scope.blogManager = function () {
            $location.path('/blog/manager');
        };

        $scope.editBlog = function (id) {
            $location.path('/blog/edit/' + id);
        };

        $scope.removeBlog = function (id) {
            HttpService.post({
                url: 'api/blog/delete/' + id,
                success: function (data) {
                    $location.path('/blog');
                }
            });
        };

        function getBlogList(userId) {
            HttpService.get({
                url: 'api/blog/list',
                params: {
                    userId: userId,
                    currentPage: 1,
                    pageSize: 10,
                    sortName: 'createDate',
                    sortType: 'desc'
                },
                success: function (data) {
                    if (data.blogs && data.blogs.length > 0) {
                        $scope.blogList = data.blogs.map(function (blog) {
                            if (blog.type === blogConstants.BLOG_TYPES_ORIGINAL) {
                                blog.typeShow = blogConstants.BLOG_TYPES_ORIGINAL_SHOW;
                                blog.type = 'origin';
                            } else if (blog.type === blogConstants.BLOG_TYPES_REPRINT) {
                                blog.typeShow = blogConstants.BLOG_TYPES_REPRINT_SHOW;
                                blog.type = 'reprint';
                            } else if (blog.type === blogConstants.BLOG_TYPES_TRANSLATION) {
                                blog.typeShow = blogConstants.BLOG_TYPES_TRANSLATION_SHOW;
                                blog.type = 'translation';
                            }
                            blog.createDate = new Date(blog.createDate).format('yyyy-MM-dd hh:mm:ss');
                            blog.lastUpdateDate = new Date(blog.lastUpdateDate).format('yyyy-MM-dd hh:mm:ss');
                            return blog;
                        });
                    }
                    $scope.totalCount = data.totalCount;
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

        function init() {
            $scope.currentUser = StorageUtils.getSessionStorage('currentUser');
            $scope.userId = $routeParams.userId || $scope.currentUser._id;
            console.log('$scope.userId', $scope.userId);
            if ($scope.userId) {
                getBlogList($scope.userId);
            }
        }
    }
]);