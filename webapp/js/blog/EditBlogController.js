/**
 * Created by freddie on 2017/2/15.
 */
var createBlogModule = angular.module('createBlog', []);

createBlogModule.controller('EditBlogController', ['$scope', '$rootScope', '$compile', '$location', '$routeParams', '$timeout', 'HttpService', 'RadioBroadcast',
    function ($scope, $rootScope, $compile, $location, $routeParams, $timeout, HttpService, RadioBroadcast) {
        $scope.blogNormalText = '';
        $scope.blogCategoryList = [];
        $scope.blogInfo = {
            title: '',
            type: '原创',
            content: '',
            summary: '',
            keyword: '',
            blogType: []
        };

        $scope.option = {
            id: 'isPublicCheckbox',
            name: 'isPublicCheckbox',
            label: '是否公开文章',
            checked: true,
            disabled: false
        };

        getBlogCategories();
        getBlogInfoWhenEdit();

        $scope.$on('blogContentNormalText', function (name, data) {
            $scope.blogNormalText = data.text;
        });
        $scope.$on('createBlogCategorySuccess', function (name, data) {
            $scope.blogCategoryList.push({
                id: 'blogTypeId_' + $scope.blogCategoryList.length,
                name: 'blogType_' + $scope.blogCategoryList.length,
                typeId: data._id,
                label: data.name,
                checked: true,
                disabled: false
            });
        });

        $scope.$on('$destroy', function () {
            RadioBroadcast.broadcast('destoryWangEditor', {id: 'createBlogContent'});
        });

        $scope.chooseBlogType = function (type) {
            $scope.blogInfo.type = type;
        };

        $scope.createBlogCategory = function () {
            var baseEle = $('.popover-container');
            var ele = $compile('<create-blog-category></create-blog-category>')($scope.$new());
            baseEle.append(ele);
        };

        $scope.saveBlog = function (eventType) {
            if (!checkBlogParams()) {
                return;
            }
            if (eventType === 'save') {
                $scope.blogInfo.status = '3';
            } else {
                if (!$scope.option.checked) {
                    $scope.blogInfo.status = '2';
                }
            }
            !$scope.blogInfo.summary && ($scope.blogInfo.summary = $scope.blogNormalText.substr(0, 200));
            $scope.blogInfo.userId = $scope.currentUser._id;
            $scope.blogCategoryList.forEach(function (item) {
                $scope.blogInfo.categories.push(item.typeId);
            });
            HttpService.post({
                url: 'api/blog/save',
                params: $scope.blogInfo,
                success: function (data) {
                    $rootScope.$broadcast('showAlertMessage', {
                        type: 'success',
                        message: '文章保存成功'
                    });
                    $timeout(function () {
                        $location.path('/blog');
                    }, 1500);
                },
                error: function (data) {
                }
            });
        };

        function getBlogCategories() {
            HttpService.get({
                url: 'api/blog/getBlogCategory',
                success: function (data) {
                    data.forEach(function (item, index) {
                        $scope.blogCategoryList.push({
                            id: 'blogTypeId_' + index,
                            name: 'blogType_' + index,
                            typeId: item._id,
                            label: item.name,
                            checked: false,
                            disabled: false
                        });
                    });
                }
            });
        }

        function getBlogInfoWhenEdit() {
            if ($routeParams.blogId) {
                HttpService.get({
                    url: 'api/blog/getBlog/' + $routeParams.blogId,
                    success: function (data) {
                        $scope.blogInfo = data;
                        $scope.blogInfo.createDate = new Date(data.createDate).format('yyyy-MM-dd hh:mm:ss');
                        $scope.blogInfo.lastUpdateDate = new Date(data.lastUpdateDate).format('yyyy-MM-dd hh:mm:ss');
                        $scope.option.checked = ($scope.blogInfo.status == '1');
                        RadioBroadcast.broadcast('initEditorContent', $scope.blogInfo);
                    },
                    error: function (data) {
                        console.log('get blog list error');
                    }
                });
            }
        }

        function checkBlogParams() {
            return $scope.blogInfo.title.trim() && $scope.blogInfo.content.trim();
        }
    }
]);

createBlogModule.directive('editBlog', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/blog/edit_blog.html',
        controller: 'EditBlogController',
        link: function (scope, elements, attrs, ngModel) {
            $('#blogTitle').focus();
        }
    }
});