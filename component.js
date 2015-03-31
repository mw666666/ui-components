/*
 * @author  qmw920@163.com
 * @home https://github.com/qmw/angular-component
 */
//定义App模块
angular.module('components', []).config(['$compileProvider', '$controllerProvider', '$provide', '$filterProvider', function($compileProvider, $controllerProvider, $provide, $filterProvider) {
    var cache = {};
    var app = {};
    var ngMap = {
        controller: $controllerProvider,
        directive: $compileProvider,
        provider: $provide,
        factory: $provide,
        service: $provide,
        constant: $provide,
        value: $provide,
        decorator: $provide,
        filter: $filterProvider
    };

    for(var key in ngMap){
        app[key] = (function(key){
            return function(name, fn){
                return wapper(key, name, arguments);
            }
        })(key);
    }

    function wapper(key, name, args){
        var hasKey = 'has' + key.replace(/^[a-z]/, function(a){
            return a.toUpperCase();
        });

        if(!cache[hasKey]){
            cache[hasKey] = {};
        }

        if(!cache[hasKey][name]){
            cache[hasKey][name] = true;
            if(key === 'controller' || key === 'filter'){
                return ngMap[key]['register'].apply(ngMap[key], args);
            }

            return ngMap[key][key].apply(ngMap[key], args);
        }       


    }

    $compileProvider.directive('uiComponent', ['$compile', '$controller',
        function($compile, $controller) {
            return {
                scope: true,
                priority: 500,
                link: function(scope, elem, attrs) {
                    var componentUrl = attrs.ngComponent;
                    if('uiLoading' in attrs){
                        elem.html('<div>加载中...</div>');
                    }
                    
                    try {
                        var componentFn = require(componentUrl);
                        if(componentFn){
                            componentExec(componentFn);                 
                        }else{
                            console.error('组件返回为空--组件地址:' + componentUrl);
                        }
                    } catch (e) {
                        require([componentUrl], function(componentFn) {
                            componentExec(componentFn);
                        });
                    }

                    function componentExec(componentFn){
                        if(!angular.isFunction(componentFn)){
                            console.error('约定组件返回地址应该函数--组件地址:' + componentUrl);
                        }
                        elem.html('');
                        componentFn(app, elem, attrs, scope);
                        $compile(elem.contents())(scope);
                        if(!scope.$$phase) {
                          scope.$apply();
                        }
                        try{
                            var componentName = getComponentName(componentUrl);
                            _G = window._G = window._G || {};
                            _G.myScope = _G.myScope || {};
                            _G.myScope[componentName] = scope;                          
                        }catch(e){

                        }
                        
                    }

                    function getComponentName(componentUrl){
                        var last = componentUrl.lastIndexOf('/');
                        var componentName = componentUrl.substr(last + 1);
                        return componentName;
                    }
                },

            };
        }
    ]);
}]);
