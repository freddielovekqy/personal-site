/**
 * Created by freddie on 2016/10/26.
 */
app.directive('mediaQuery', function () {
    return {
        restrict: 'A',
        scope: false,
        replace: true,
        link: function (scope, elements, attrs) {
            console.log('scope', scope);
            console.log('elements', elements);
            console.log('attrs', attrs);
            console.log('window.screen', window.screen)
            if (attrs.mediaQuery === '123') {
                elements.show();
            } else {
                elements.hide();
            }
        }
    };
});