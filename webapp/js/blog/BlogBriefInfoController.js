/**
 * Created by freddie on 2017/4/9.
 */
var blogBriefInfoModule = angular.module('blogBriefInfo', []);

blogBriefInfoModule.controller('BlogBriefInfoController', ['$scope',
    function ($scope) {

        $scope.blogInfo = {
            userId: '',
            userName: '柯沁怡',
            userImage: 'image/users/58426f4f482bc73140d93211/head.jpg',
            createDate: new Date().format('yyyy-MM-dd hh:mm'),
            source: '荣耀6',
            content: '瞬间感觉整个人智商都提高了',
            isCurrentUser: false,
            isHaveCollected: true,
            isHaveFavor: true,
            replyNum: 0,
            commentsNum: 0,
            goodNum: 1,
            originBlogInfo: {
                userId: '',
                userName: '史蒂芬霍金',
                userImage: '',
                content: 'Greetings to my friends in China! It has been too long! I last visited China in 2006 when ' +
                'I took part in a physics conference in Beijing. It was an extraordinary experience. My first trip was in 1985 when I travelled across your rem',
                createDate: new Date().format('yyyy-MM-dd hh:mm'),
                isHaveFavor: true,
                source: '荣耀6',
                replyNum: 0,
                commentsNum: 0,
                goodNum: 1
            }
        };
    }
]);
blogBriefInfoModule.directive('blogBriefInfo', function () {
    return {
        restrict: 'E',
        require: '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/blog/blog_brief_info.html',
        controller: 'BlogBriefInfoController',
        link: function (scope, elements, attrs, ngModel) {

        }
    };
});