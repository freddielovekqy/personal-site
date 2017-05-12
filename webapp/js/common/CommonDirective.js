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
                    scope.$broadcast(attrs.id + 'blogContentNormalText', {text: editor.$txt.text()});
                });
            };
            editor.create();

            var emptyContentSub = postal.subscribe({
                channel: 'wangEditor',
                topic: 'emptyContent',
                callback: data => {
                    editor.$txt.html('<p><br></p>');
                }
            });

            var initContentSub = postal.subscribe({
                channel: 'wangEditor',
                topic: 'initContent',
                callback: data => {
                    if (data && data.content) {
                        editor.$txt.html(data.content);
                    }
                }
            });

            scope.$on('initEditorContent', function (name, data) {
                if (data && data.content) {
                    editor.$txt.html(data.content);
                }
            });
            scope.$on('destoryWangEditor', function (name, data) {
                if (attrs.id === data.id) {
                    editor.destroy();
                    editor = null;
                }
            });

            scope.$on('destroy', () => {
                console.log('wangEditor destroy');
                emptyContentSub.unsubscribe();
                initContentSub.unsubscribe();
            });
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

app.directive('popoverMovable', function () {
    return {
        restrict: 'A' ,
        controller: function () {

        },
        link: function(scope, element, attrs, ngModel) {
            var sourcePosition = {};
            var mousedown = false;
            var mouseup = false;
            element.on('mousedown', function (event) {
                if ($(event.target).hasClass('popover-title')) {
                    mousedown = true;
                    mouseup = false;
                    sourcePosition = {
                        x: event.pageX,
                        y: event.pageY
                    };
                    console.log('event.pageX', event.pageX, 'event.pageY', event.pageY);
                }
            });

            element.on('mouseup', function (event) {
                mouseup = true;
            });

            element.on('mousemove', function (event) {
                if (mousedown && !mouseup) {
                    console.log('event.pageX', event.pageX, 'event.pageY', event.pageY);
                    var move = {
                        x: event.pageX - sourcePosition.x,
                        y: event.pageY - sourcePosition.y
                    };
                    $(this).css({
                        left: move.x + 'px',
                        top: move.y + 'px'
                    });
                }
            });
        }
    };
});

app.directive('messagePopover', function () {
    return {
        restrict: 'E' ,
        templateUrl: 'views/tlps/common/message_popover.html',
        controller: function ($scope) {
            $scope.option.buttons && $scope.option.buttons.forEach(button => {
                if (button.id === 'cancel' || button.id === 'ok') {
                    var callback = button.callback;
                    button.callback = function () {
                        callback && callback();
                        $scope.$destroy();
                    };
                }
            });
        },
        link: function(scope, element, attrs, ngModel) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});

app.directive('customerCheckbox', function () {
    return {
        restrict: 'E',
        scope: {
            option: '='
        },
        require : '?ngModel',
        replace: true,
        templateUrl: 'views/tlps/common/f_checkbox.html',
        link: function (scope, elements, attrs, ngModel) {
            scope.changeValue = function () {
                scope.option.checked = !scope.option.checked;
            };
        }
    };
});

app.directive('switch', function () {
    return {
        restrict: 'E',
        scope: {
            option: '=option'
        },
        replace: true,
        templateUrl: 'views/tlps/common/switch.html',
        controller: ['$scope', function ($scope) {
            $scope.switchText = $scope.option.checked ? 'ON' : 'OFF';
            if ($scope.option.disabled === undefined) {
                $scope.option.disabled = false;
            }
            $scope.switchHandler = function () {
                if (!$scope.option.disabled) {
                    $scope.option.checked = !$scope.option.checked;
                    $scope.switchText = $scope.option.checked ? 'ON' : 'OFF';
                }
            }
        }],
        link: function (scope, elements, attrs, ngModel) {
            console.log('switch', scope.option);
        }
    };
});

// TODO 后续继续开发
app.directive('loading', function () {
    return {
        restrict: 'E',
        scope: {
            recent: '='
        },
        replace: true,
        templateUrl: 'views/tlps/common/loading.html',
        link: function (scope, elements, attrs, ngModel) {
            console.log(scope.list);
        }
    };
});

app.directive('customerCheckboxList', function () {
    return {
        restrict: 'E',
        scope: {
            list: '='
        },
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
            elements.on('keyup focus', function () {
                var result = scope.customValidator();
                console.log(result);
                if (!result.isValid) {
                    $(this).next().show();
                    $(this).addClass('input-has-error');
                } else {
                    $(this).next().hide();
                    $(this).removeClass('input-has-error');
                }
            });

            elements.on('mouseover', function () {
                var result = scope.customValidator();
                if (!result.isValid) {
                    $(this).next().show();
                } else {
                    $(this).next().hide();
                }
            });

            elements.on('mouseleave', function () {
                $(this).next().hide();
            });
        }
    };
});

app.directive('tooltip', function () {
    return {
        restrict: 'E',
        scope: {
            tooltipMessage: '='
        },
        replace: true,
        template: '<div class="my-tooltip top"><div class="my-tooltip-arrow"></div><div class="my-tooltip-inner">{{tooltipMessage}}</div></div>',
        link: function (scope, elements, attrs, ngModel) {
            var position = $(elements).prev().position();
            $(elements).css({
                top: position.top - 40,
                left: position.left
            });
            console.log($(elements).prev());
        }
    };
});
