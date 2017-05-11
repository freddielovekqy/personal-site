'use strict';

var homeModule = angular.module('home', []);

homeModule.controller('HomeController', ['$scope', '$timeout', 'HttpService', 'CommonUtils', 'CommonUserUtils',
    function ($scope, $timeout, HttpService, CommonUtils, CommonUserUtils) {
        console.log('home page init');

        $scope.hotTopics = [];
        $scope.simpleBlog = {
            content: '',
            source: '网页'
        };

        (function () {
            var result = CommonUserUtils.getCurrentUserBlogInfo();
            if (result instanceof Promise) {
                result.then( (data) => {
                    $timeout(() => {
                        $scope.currentUserBlogInfo = data;
                    }, 0);
                });
            } else {
                $scope.currentUserBlogInfo = result;
            }
            getHomePageContent();
        })();

        $scope.saveSimpleBlog = function () {
            HttpService.post({
                url: 'api/simpleBlog',
                params: {
                    simpleBlog: $scope.simpleBlog
                },
                success: data => {
                    $scope.simpleBlog = {
                        content: '',
                        source: '网页'
                    };
                    CommonUtils.showAlertMessage({
                        type: 'success',
                        message: '发表微博成功'
                    });
                }
            });
        };

        function getHomePageContent() {
            HttpService.get({
                url: 'api/home/content',
                success: contents => {
                    $scope.contents = contents;
                }
            });
        }

        for (var i = 0; i < 8; i++) {
            $scope.hotTopics.push({
                id: '',
                topicName: '极限挑战',
                topicIndex: 1999
            });
        }

    }
]);