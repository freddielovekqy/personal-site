var blogArticleModule = angular.module('blogArticleManager', []);

blogArticleModule.controller('BlogArticleManagerController', ['$scope', 'HttpService', 'SessionStorageUtils',
    function ($scope, HttpService, SessionStorageUtils) {
        $scope.currentUser = SessionStorageUtils.getItem('currentUser');
        $scope.blogList = [];
        $scope.blogCategories = [];
        $scope.blogTypes = [
            {
                value: '全部'
            },{
                value: '原创'
            }, {
                value: '转载'
            }, {
                value: '译文'
            }
        ];
        $scope.selectedBlogType = $scope.blogTypes[0];

        getBlogCategories();
        getBlogList($scope.currentUser._id);

        $scope.searchBlogHandler = function () {

        };


        function getBlogCategories() {
            HttpService.get({
                url: 'api/blog/getBlogCategory',
                success: function (data) {
                    $scope.blogCategories = data;
                    $scope.blogCategories.unshift({
                        _id: '0',
                        name: '全部'
                    });
                    $scope.selectedBlogCategory = $scope.blogCategories[0];
                }
            });
        }

        function getBlogList(userId) {
            HttpService.get({
                url: 'api/blog/list',
                params: {
                    userId: userId,
                    currentPage: 1,
                    pageSize: 20,
                    sortName: 'createDate',
                    sortType: 'desc'
                },
                success: function (data) {
                    if (data.blogs && data.blogs.length > 0) {
                        $scope.blogList = data.blogs.map(function (blog) {
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
    }
]);

blogArticleModule.directive('blogArticleManager', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/blog/blog_article_manager.html',
        controller: 'BlogArticleManagerController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});