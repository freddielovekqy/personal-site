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
blogListModule.controller('BlogListController', ['$scope', 'HttpService', 'SessionStorageUtils', 'blogConstants', '$routeParams',
    function ($scope, HttpService, SessionStorageUtils, blogConstants, $routeParams) {
        var currentUser = SessionStorageUtils.getItem('currentUser');
        console.log(123);
        $scope.blogCountMap = {
            originCount: 0,
            rePrintCount: 0,
            translationCount: 0
        };

        init();

        function getUserInfo(userId) {
            HttpService.get({
                url: 'api/userBlogInfo/getInfo/' + userId,
                success: function (data) {
                    $scope.userBlogInfo = data;
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
            HttpService.get({
                url: 'api/user/getUserInfo/' + userId,
                success: function (data) {
                    $scope.user = data;
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

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
                                $scope.blogCountMap.originCount++;
                            } else if (blog.type === blogConstants.BLOG_TYPES_REPRINT) {
                                blog.typeShow = blogConstants.BLOG_TYPES_REPRINT_SHOW;
                                blog.type = 'reprint';
                                $scope.blogCountMap.rePrintCount++;
                            } else if (blog.type === blogConstants.BLOG_TYPES_TRANSLATION) {
                                blog.typeShow = blogConstants.BLOG_TYPES_TRANSLATION_SHOW;
                                blog.type = 'translation';
                                $scope.blogCountMap.translationCount++;
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
            var userId = $routeParams.userId || currentUser._id;
            if (userId) {
                getUserInfo(userId);
                getBlogList(userId);
            }
        }
    }
]);