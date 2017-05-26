/**
 * Created by freddie on 2017/2/19.
 */
var blogCategoryModule = angular.module('blogCategory', []);

blogCategoryModule.controller('BlogCategoryManagerController', ['$scope', '$rootScope', 'HttpService', 'RadioBroadcast',
    function ($scope, $rootScope, HttpService, RadioBroadcast) {
        var updateBlogCategoryBackup = {};
        $scope.tooltipMessage = '输入错误';
        $scope.blogCategorys = [];
        $scope.blogCategory = {
            name: ''
        };

        getBlogCategories();

        $scope.categoryValidator = function () {
            var blogCategory = $scope.blogCategory.name.trim();
            var result = {
                isValid: true
            };
            for (var i = 0; i < $scope.blogCategorys.length; i++) {
                if ($scope.blogCategorys[i].name === blogCategory) {
                    result.isValid = false;
                    break;
                }
            }
            return result;
        };

        $scope.addBlogCategory = function () {
            if (!$scope.blogCategory.name.trim()) {
                return;
            }
            HttpService.post({
                url: 'api/blog/createBlogCategory',
                params: $scope.blogCategory,
                success: function (data) {
                    data.update = false;
                    $scope.blogCategorys.push(data);
                    $scope.blogCategory.name = '';
                },
                error: function (data) {
                }
            });
        };

        $scope.createKeyDown = function (event) {
            var keyCode = event.keyCode || event.which;
            if (keyCode === 13) {
                $scope.addBlogCategory();
            }
        };

        $scope.editBlogCategory = function (item) {
            $scope.blogCategorys.forEach(function (category) {
                category.update = false;
            });
            item.update = true;
            updateBlogCategoryBackup = angular.copy(item);
        };

        $scope.updateBlogCategory = function (item) {
            HttpService.post({
                url: 'api/blog/updateBlogCategory',
                params: {
                    id: item._id,
                    name: item.name
                },
                success: function (data) {
                    item.update = false;
                    console.log($scope.blogCategorys);
                    updateBlogCategoryBackup = {};
                },
                error: function () {
                    item.name = updateBlogCategoryBackup.name;
                    item.update = false;
                    updateBlogCategoryBackup = {};
                }
            });
        };

        $scope.cancel = function (item) {
            item.name = updateBlogCategoryBackup.name;
            updateBlogCategoryBackup = {};
        };

        $scope.delete = function (item) {
            // TODO 级联删除动作
            updateBlogCategoryBackup = {};
            HttpService.post({
                url: 'api/blog/deleteBlogCategory/' + item._id,
                success: function (data) {
                    RadioBroadcast.broadcast('showAlertMessage', {
                        type: 'success',
                        message: '删除成功'
                    });
                    $scope.blogCategorys = $scope.blogCategorys.filter(function (category) {
                        return category._id !== item._id;
                    });
                },
                error: function () {
                }
            });
        };

        function getBlogCategories() {
            HttpService.get({
                url: 'api/blog/getBlogCategory',
                success: function (data) {
                    $scope.blogCategorys = data.map(function (item) {
                        item.update = false;
                        return item;
                    });
                }
            });
        }
    }
]);

blogCategoryModule.directive('blogCategoryManager', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/blog/category_manager.html',
        controller: 'BlogCategoryManagerController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});