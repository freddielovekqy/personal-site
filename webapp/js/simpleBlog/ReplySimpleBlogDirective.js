/**
 * Created by freddie on 2017/5/13.
 */
simpleBlogModule.directive('', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        scope: {
        },
        replace: true,
        templateUrl: 'views/tlps/simpleBlog/reply_simple_blog.html',
        controller: [],
        link: function(scope, element, attrs, ngModel) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});