/**
 * Created by freddie on 2017/2/15.
 */
var createBlogModule = angular.module('createBlog', []);

createBlogModule.controller('CreateBlogController', ['$scope', '$rootScope', '$compile', '$location', '$timeout', 'HttpService',
    function ($scope, $rootScope, $compile, $location, $timeout, HttpService) {
        $scope.blogNormalText = '';
        console.log('$scope.currentSelectTab', $scope.currentSelectTab);
        $scope.$on('createBlogContentNormalText', function (name, data) {
            $scope.blogNormalText = data.text;
        });

        $scope.blogInfo = {
            title: '',
            type: '原创',
            content: '',
            summary: '',
            keyword: ''
        };

        $scope.option = {
            id: 'isPublicCheckbox',
            name: 'isPublicCheckbox',
            label: '是否公开文章',
            checked: true,
            disabled: false
        };

        $scope.option2 = {
            title: 'test title'
        };

        $scope.chooseBlogType = function (type) {
            $scope.blogInfo.type = type;
        };

        $scope.createPersonalType = function () {
            var baseEle = $('.popover-container');
            var ele = $compile('<create-personal-type></create-personal-type>')($scope.$new());
            baseEle.append(ele);
        };

        $scope.saveBlog = function (eventType) {
            if (eventType === 'save') {
                $scope.blogInfo.status = '3';
            } else {
                if (!$scope.option.checked) {
                    $scope.blogInfo.status = '2';
                }
            }
            if (!$scope.blogInfo.summary) {
                $scope.blogInfo.summary = $scope.blogNormalText.substr(0, 200);
            }
            $scope.blogInfo.userId = $scope.currentUser._id;
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

        $scope.list = [
            {
                id: 'test',
                name: 'test',
                label: 'Spring',
                checked: true,
                disabled: false
            }, {
                id: 'test1',
                name: 'test1',
                label: 'Spring1',
                checked: true,
                disabled: false
            }
        ];
    }
]);

createBlogModule.directive('createBlog', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/blog/create.html',
        controller: 'CreateBlogController',
        link: function (scope, elements, attrs, ngModel) {

        }
    }
});