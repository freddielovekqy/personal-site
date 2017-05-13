/**
 * Created by freddie on 2017/5/13.
 */
simpleBlogModule.directive('replySimpleBlog', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        scope: {
        },
        replace: true,
        templateUrl: 'views/tlps/simpleBlog/reply_simple_blog.html',
        controller: ['$scope', '$timeout', function ($scope, $timeout) {
            $scope.simpleBlog = {
                content: '',
                source: '网页',
                jurisdiction: 1
            };
            $scope.showJurisdictionsFlag = false;

            $scope.showJurisdictionOptions = function () {
                $scope.showJurisdictionsFlag = !$scope.showJurisdictionsFlag;
            };

            $scope.changeJurisdiction = function (jurisdiction) {
                $scope.simpleBlog.jurisdiction = jurisdiction;
            };

            var hideOptionsSub = postal.subscribe({
                channel: 'homePage',
                topic: 'hideAllJurisdictionOptions',
                callback: () => {
                    $scope.showJurisdictionsFlag = false;
                }
            });

            $scope.$on('$destroy', () => {
                hideOptionsSub && hideOptionsSub.unsubscribe();
            });
        }],
        link: function(scope, element, attrs, ngModel) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});