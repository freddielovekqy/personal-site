/**
 * Created by freddie on 2016/10/26.
 */
app.directive('mediaQuery', function () {
    return {
        restrict: 'A',
        scope: false,
        replace: true,
        link: function (scope, elements, attrs) {
            var mediaQueryRange = attrs.mediaQuery.split('-');
            var currentScreenWidth = window.screen.width;

            if (currentScreenWidth >= parseInt(mediaQueryRange[0] || 0) && currentScreenWidth <= parseInt(mediaQueryRange[1] || 4000)) {
                elements.show();
            } else {
                elements.hide();
            }
        }
    };
});

app.directive('customerCheckbox', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/common/f_checkbox.html',
        controller: function ($scope) {
        },
        link: function (scope, elements, attrs, ngModel) {
            elements.find('[type="checkbox"]').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });

            if (scope.option.checked) {
                elements.find('[type="checkbox"]').iCheck('check');
            } else {
                elements.find('[type="checkbox"]').iCheck('uncheck');
            }


            elements.on('ifChecked', '[type="checkbox"]', function (event) {
                scope.option.checked = true;
                ngModel.$setViewValue(ngModel.$modelValue);
            });

            elements.on('ifUnchecked', '[type="checkbox"]', function (event) {
                scope.option.checked = false;
                ngModel.$setViewValue(ngModel.$modelValue)
            });
        }
    };
});

app.directive('customValidator', function () {
    return {
        restrict: 'A',
        scope: {
            customValidator: '='
        },
        require : '?ngModel',
        replace: true,
        link: function (scope, elements, attrs, ngModel) {
            var customerValidatorFun = scope.customValidator;
            // TODO 可能会有性能问题
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (newVal, oldVal) {
                var result = customerValidatorFun();
                console.log('change...', newVal, oldVal, result);
            });
        }
    };
});