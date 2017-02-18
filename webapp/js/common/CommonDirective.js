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

app.directive('wangEditor', function() {
    return {
        restrict: 'A' ,
        require: 'ngModel',
        controller: function () {

        },
        link: function(scope, element, attrs, ngModel) {
            // 创建编辑器
            var editor = new wangEditor(attrs.id);
            editor.onchange = function () {
                // 从 onchange 函数中更新数据
                scope.$apply(function () {
                    var html = editor.$txt.html();
                    ngModel.$setViewValue(html);
                    // 讲纯文本传递出去
                    scope.$broadcast(attrs.id + 'NormalText', {text: editor.$txt.text()});
                });
            };
            editor.create();
        }
    };
});

app.directive('popover', function () {
    return {
        restrict: 'E' ,
        scope: {
            option: '='
        },
        templateUrl: 'views/tlps/common/popover.html',
        controller: function ($scope) {
            // $scope.option = $scope.$parent.option;
        },
        link: function(scope, element, attrs, ngModel) {
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

app.directive('customerCheckboxList', function () {
    return {
        restrict: 'E',
        require : '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/common/f_checkbox_list.html',
        link: function (scope, elements, attrs, ngModel) {
            console.log(scope.list);
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