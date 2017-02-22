/**
 * Created by freddie on 2017/2/19.
 */
var blogTypeModule = angular.module('blogCategory', []);

blogTypeModule.controller('BlogCategoryManagerController', ['$scope', '$rootScope', 'HttpService', 'RadioBroadcast',
    function ($scope, $rootScope, HttpService, RadioBroadcast) {
        var updateBlogTypeBackup = {};
        $scope.tooltipMessage = '输入错误';
        $scope.blogTypes = [];
        $scope.blogType = {
            name: ''
        };

        getBlogTypes();

        $scope.typeValidator = function () {
            var blogType = $scope.blogType.name.trim();
            var result = {
                isValid: true
            };
            for (var i = 0; i < $scope.blogTypes.length; i++) {
                if ($scope.blogTypes[i].name === blogType) {
                    result.isValid = false;
                    break;
                }
            }
            return result;
        };

        $scope.addBlogType = function () {
            if (!$scope.blogType.name.trim()) {
                return;
            }
            HttpService.post({
                url: 'api/blog/createBlogType',
                params: $scope.blogType,
                success: function (data) {
                    data.update = false;
                    $scope.blogTypes.push(data);
                    $scope.blogType.name = '';
                },
                error: function (data) {
                }
            });
        };

        $scope.createKeyDown = function (event) {
            var keyCode = event.keyCode || event.which;
            if (keyCode === 13) {
                $scope.addBlogType();
            }
        };

        $scope.editBlogType = function (item) {
            $scope.blogTypes.forEach(function (type) {
                type.update = false;
            });
            item.update = true;
            updateBlogTypeBackup = angular.copy(item);
        };

        $scope.updateBlogType = function (item) {
            HttpService.post({
                url: 'api/blog/updateBlogType',
                params: {
                    id: item._id,
                    name: item.name
                },
                success: function (data) {
                    item.update = false;
                    console.log($scope.blogTypes);
                    updateBlogTypeBackup = {};
                },
                error: function () {
                    item.name = updateBlogTypeBackup.name;
                    item.update = false;
                    updateBlogTypeBackup = {};
                }
            });
        };

        $scope.cancel = function (item) {
            item.name = updateBlogTypeBackup.name;
            updateBlogTypeBackup = {};
        };

        $scope.delete = function (item) {
            // TODO 级联删除动作
            updateBlogTypeBackup = {};
            HttpService.post({
                url: 'api/blog/deleteBlogType/' + item._id,
                success: function (data) {
                    RadioBroadcast.broadcast('showAlertMessage', {
                        type: 'success',
                        message: '删除成功'
                    });
                    $scope.blogTypes = $scope.blogTypes.filter(function (type) {
                        return type._id !== item._id;
                    });
                },
                error: function () {
                }
            });
        };

        function getBlogTypes() {
            HttpService.get({
                url: 'api/blog/getBlogType',
                success: function (data) {
                    $scope.blogTypes = data.map(function (item) {
                        item.update = false;
                        return item;
                    });
                }
            });
        }
    }
]);

blogTypeModule.directive('blogCategoryManager', function () {
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