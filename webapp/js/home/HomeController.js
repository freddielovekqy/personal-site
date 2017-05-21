'use strict';

var homeModule = angular.module('home', []);

homeModule.controller('HomeController', ['$scope', '$timeout', 'HttpService', 'CommonUtils', 'CommonUserUtils',
    function ($scope, $timeout, HttpService, CommonUtils, CommonUserUtils) {
        console.log('home page init');

        $scope.hotTopics = [];
        $scope.simpleBlog = {
            content: '',
            source: '网页',
            jurisdiction: 1
        };
        $scope.showJurisdictionsFlag = false;
        $scope.shownPage = 'home';
        $scope.currentShowContentType = 'simpleBlog';

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

        $scope.changeContentType = function (contentType) {
            $scope.currentShowContentType = contentType;

            if ($scope.currentShowContentType === 'simpleBlog') {
                getHomeSimpleBlog();
            } else if ($scope.currentShowContentType === 'blog') {
                getHomeBlog();
            }
        };

        $scope.changeShowPage = function (page) {
            $scope.shownPage = page;

            if ($scope.shownPage === 'hotSimpleBlog') {
                getAllSimpleBlog();
            } else if ($scope.shownPage === 'home') {
                getHomeSimpleBlog();
            }
        };

        $scope.showJurisdictionOptions = function () {
            $scope.showJurisdictionsFlag = !$scope.showJurisdictionsFlag;
        };

        $scope.changeJurisdiction = function (jurisdiction) {
            $scope.simpleBlog.jurisdiction = jurisdiction;
        };

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
                    getHomePageContent();
                    CommonUtils.showAlertMessage({
                        type: 'success',
                        message: '发表微博成功'
                    });
                }
            });
        };

        function getHomeSimpleBlog() {
            HttpService.get({
                url: 'api/home/content',
                success: contents => {
                    $scope.contents = contents;
                }
            });
        }

        function getHomeBlog() {
            HttpService.get({
                url: 'api/blog/home',
                success: blogs => {
                    $scope.contents = blogs;
                }
            });
        }

        function getAllSimpleBlog() {
            HttpService.get({
                url: 'api/simpleBlog/recent',
                success: contents => {
                    $scope.contents = contents;
                }
            });
        }

        function getHomePageContent() {
            HttpService.get({
                url: 'api/home/content',
                success: contents => {
                    $scope.contents = contents;
                }
            });
        }

        $('body').bind('click', hideOperations);

        function hideOperations(event) {
            if (!$(event.target).hasClass('show-content-operations')) {
                postal.publish({
                    channel: 'homePage',
                    topic: 'hideAllOperations',
                    data: {}
                });
            }
            if (!($(event.target).hasClass('simple-blog-privilege-level-set') || $(event.target).parent().hasClass('simple-blog-privilege-level-set'))) {
                $timeout(() => {
                    $scope.showJurisdictionsFlag = false;
                }, 0);
                postal.publish({
                    channel: 'homePage',
                    topic: 'hideAllJurisdictionOptions',
                    data: {}
                });
            }
        }

        var shieldContentSub = postal.subscribe({
            channel: 'homePage',
            topic: 'shieldContent',
            callback: data => {
                $scope.contents = $scope.contents.filter(content => {
                    return content._id !== data.contentId;
                });
            }
        });

        var shieldUserSub = postal.subscribe({
            channel: 'homePage',
            topic: 'shieldUser',
            callback: data => {
                $scope.contents = $scope.contents.filter(content => {
                    return content.userId !== data.userId;
                });
            }
        });

        var refreshContentSub = postal.subscribe({
            channel: 'homePage',
            topic: 'refreshHomeContent',
            callback: (data) => {
                getHomePageContent();
            }
        });

        for (var i = 0; i < 8; i++) {
            $scope.hotTopics.push({
                id: '',
                topicName: '极限挑战',
                topicIndex: 1999
            });
        }

        $scope.$on('$destroy', function () {
            $('body').unbind('click', hideOperations);
            refreshContentSub && refreshContentSub.unsubscribe();
            shieldContentSub && shieldContentSub.unsubscribe();
            shieldUserSub && shieldUserSub.unsubscribe();
        });

    }
]);