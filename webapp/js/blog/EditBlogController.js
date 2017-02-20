/**
 * Created by freddie on 2017/2/15.
 */
var createBlogModule = angular.module('createBlog', []);

createBlogModule.controller('EditBlogController', ['$scope', '$rootScope', '$compile', '$location', '$timeout', 'HttpService', 'RadioBroadcast',
    function ($scope, $rootScope, $compile, $location, $timeout, HttpService, RadioBroadcast) {
        $scope.blogNormalText = '';
        $scope.blogTypeList = [];
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

        getBlogTypes();

        $scope.$on('blogContentNormalText', function (name, data) {
            $scope.blogNormalText = data.text;
        });
        $scope.$on('createBlogTypeSuccess', function (name, data) {
            $scope.blogTypeList.push({
                id: 'blogTypeId_' + $scope.blogTypeList.length,
                name: 'blogType_' + $scope.blogTypeList.length,
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

        $scope.createPersonalType = function () {
            var baseEle = $('.popover-container');
            var ele = $compile('<create-personal-type></create-personal-type>')($scope.$new());
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
            $scope.blogTypeList.forEach(function (item) {
                $scope.blogInfo.blogType.push(item.typeId);
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

        function getBlogTypes() {
            HttpService.get({
                url: 'api/blog/getBlogType',
                success: function (data) {
                    data.forEach(function (item, index) {
                        $scope.blogTypeList.push({
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

        }
    }
});