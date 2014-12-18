/*
 * @author  qmw920@163.com
 * @home https://github.com/atian25/angular-lazyload
 */
angular.module('component', [])
.config(['$compileProvider', '$controllerProvider', '$provide', function($compileProvider, $controllerProvider, $provide){
    var register = $controllerProvider.register;
    var app = {
        controller: $controllerProvider.register,
        directive: $compileProvider.directive,
        provider: $provide.provider,
        factory: $provide.factory,
        service: $provide.service,
        constant: $provide.constant,
        value: $provide.value,
        decorator: $provide.decorator
    }
    $compileProvider.directive('uiComponent', ['$compile',
        function($compile){
            return{
                scope: true,
                priority: 500,
                link: function(scope, elem, attrs){
                    var componentUrl = attrs.ngComponent;
                    try{
                        var componentFn = require(componentUrl);
                        if(componentFn){
                            componentExec(componentFn);
                        }else{
                            console.error('组件返回为空--组件地址:' + componentUrl);
                        }
                    }catch(e){
                        require([componentUrl], function(componentFn){
                            componentExec(componentFn);
                        });
                    }

                    function componentExec(componentFn){
                        if(!angular.isFunction(componentFn)){
                            console.error('目前约定组件返回地址应该函数--组件地址:' + componentUrl);
                        }

                        componentFn(app, elem, attrs, scope);
                        $compile(elem.contents())(scope);
                        if(!scope.$$phase){
                            scope.$apply();
                        }
                    }
                }
            };
        }
    ]);
}]);