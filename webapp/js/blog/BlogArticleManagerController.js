var blogArticleModule = angular.module('blogArticleManager', []);

blogArticleModule.controller('BlogArticleManagerController', ['$scope', '$location', 'HttpService', 'StorageUtils',
    function ($scope, $location, HttpService, StorageUtils) {
        $scope.currentUser = StorageUtils.getSessionStorage('currentUser');
        $scope.blogList = [];
        $scope.blogCategories = [
            {
                _id: '0',
                name: '全部'
            }
        ];
        $scope.blogTypes = [
            {
                id: '0',
                value: '全部'
            },{
                id: '1',
                value: '原创'
            }, {
                id: '2',
                value: '转载'
            }, {
                id: '3',
                value: '译文'
            }
        ];
        $scope.searchOption = {
            title: '',
            selectedBlogType: $scope.blogTypes[0],
            selectedBlogCategory: $scope.blogCategories[0]
        };

        getBlogCategories();
        getBlogList($scope.currentUser._id);

        $scope.searchBlogHandler = function () {
            getBlogList($scope.currentUser._id);
        };

        $scope.searchTitleKeyPressHandler = function (event) {
            var keyCode = event.keyCode || event.which;
            if (keyCode === 13) {
                getBlogList($scope.currentUser._id);
            }
        };

        $scope.deleteBlog = function (id) {
            HttpService.delete({
                url: 'api/blog/' + id,
                success: function (data) {
                    getBlogList($scope.currentUser._id);
                }
            });
        };

        $scope.editBlog = function (id) {
            $location.path('/blog/edit/' + id);
        };

        $scope.topShow = function (id, topShow) {
            HttpService.post({
                url: 'api/blog/topShow',
                params: {
                    id: id,
                    topShow: topShow
                },
                success: function (data) {
                    getBlogList($scope.currentUser._id);
                }
            });
        };

        $scope.commentAble = function (id, commentAble) {
            HttpService.post({
                url: 'api/blog/commentAble',
                params: {
                    id: id,
                    commentAble: commentAble
                },
                success: function (data) {
                    getBlogList($scope.currentUser._id);
                }
            });
        };


        function getBlogCategories() {
            HttpService.get({
                url: 'api/blog/getBlogCategory',
                success: function (data) {
                    data.forEach(function (category) {
                        $scope.blogCategories.push(category);
                    });
                }
            });
        }

        function getBlogList(userId) {
            var params = {
                userId: userId,
                currentPage: 1,
                pageSize: 20,
                sortName: 'createDate',
                sortType: 'desc',
                title: $scope.searchOption.title
            };
            if ($scope.searchOption.selectedBlogCategory._id !== '0') {
                params.categories = [$scope.searchOption.selectedBlogCategory._id];
            }
            if ($scope.searchOption.selectedBlogType.id !== '0') {
                params.type = $scope.searchOption.selectedBlogType.value;
            }
            HttpService.get({
                url: 'api/blog/list',
                params: params,
                success: function (data) {
                    $scope.blogList = [];
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