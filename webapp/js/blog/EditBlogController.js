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
            categories: []
        };

        $scope.option = {
            id: 'isPublicCheckbox',
            name: 'isPublicCheckbox',
            label: '是否公开文章',
            checked: true,
            disabled: false
        };

        (function () {
            if ($routeParams.blogId) {
                getBlogInfoWhenEdit();
            } else {
                getBlogCategories([]);
            }
        })();

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
                $scope.blogInfo.status = $scope.option.checked ? '1' : '2';
            }
            !$scope.blogInfo.summary && ($scope.blogInfo.summary = $scope.blogNormalText.substr(0, 200));
            $scope.blogInfo.userId = $scope.currentUser._id;
            $scope.blogInfo.categories = [];
            $scope.blogCategoryList.forEach(function (item) {
                item.checked && $scope.blogInfo.categories.push(item.typeId);
            });
            var url = !!$scope.blogInfo._id ? 'api/blog/update' : 'api/blog/save';
            HttpService.post({
                url: url,
                params: {
                    blog: $scope.blogInfo
                },
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

        function getBlogCategories(checkedCategories) {
            HttpService.get({
                url: 'api/blog/getBlogCategory',
                success: function (data) {
                    data.forEach(function (item, index) {
                        $scope.blogCategoryList.push({
                            id: 'blogTypeId_' + index,
                            name: 'blogType_' + index,
                            typeId: item._id,
                            label: item.name,
                            checked: checkedCategories.indexOf(item._id) > -1,
                            disabled: false
                        });
                    });
                }
            });
        }

        function getBlogInfoWhenEdit() {
            HttpService.get({
                url: 'api/blog/getBlog/' + $routeParams.blogId,
                success: function (data) {
                    $scope.blogInfo = data;
                    $scope.blogInfo.createDate = new Date(data.createDate).format('yyyy-MM-dd hh:mm:ss');
                    $scope.blogInfo.lastUpdateDate = new Date(data.lastUpdateDate).format('yyyy-MM-dd hh:mm:ss');
                    $scope.option.checked = ($scope.blogInfo.status == '1');
                    // RadioBroadcast.broadcast('initEditorContent', $scope.blogInfo);
                    postal.publish({
                        channel: 'wangEditor',
                        topic: 'initContent',
                        data: $scope.blogInfo
                    });
                    getBlogCategories($scope.blogInfo.categories);
                },
                error: function (data) {
                    console.log('get blog list error');
                }
            });
        }

        function checkBlogParams() {
            return $scope.blogInfo.title.trim() && $scope.blogInfo.content.trim();
        }

        var normalContentText = postal.subscribe({
            channel: 'wangEditor',
            topic: 'normalText',
            callback: data => {
                if (data.id === 'createBlogContent') {
                    $scope.blogNormalText = data.text;
                }
            }
        });
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