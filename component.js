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
    appendLoadStyle();
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
                        elem.html('<div class="component-spinner"> <div class="component-spinner-container component-container1"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> <div class="component-spinner-container component-container2"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> <div class="component-spinner-container component-container3"> <div class="circle1"></div> <div class="circle2"></div> <div class="circle3"></div> <div class="circle4"></div> </div> </div>');
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

    function appendLoadStyle(){

        var loadingStyle = '.component-spinner {margin: 100px auto; width: 50px; height: 50px; position: relative; } .component-container1 > div, .component-container2 > div, .component-container3 > div {width: 12px; height: 12px; background-color: #67CF22; border-radius: 100%; position: absolute; -webkit-animation: bouncedelay 1.2s infinite ease-in-out; animation: bouncedelay 1.2s infinite ease-in-out; -webkit-animation-fill-mode: both; animation-fill-mode: both; } .component-spinner .component-spinner-container {position: absolute; width: 100%; height: 100%; } .component-container2 {-webkit-transform: rotateZ(45deg); transform: rotateZ(45deg); } .component-container3 {-webkit-transform: rotateZ(90deg); transform: rotateZ(90deg); } .circle1 { top: 0; left: 0; } .circle2 { top: 0; right: 0; } .circle3 { right: 0; bottom: 0; } .circle4 { left: 0; bottom: 0; } .component-container2 .circle1 {-webkit-animation-delay: -1.1s; animation-delay: -1.1s; } .component-container3 .circle1 {-webkit-animation-delay: -1.0s; animation-delay: -1.0s; } .component-container1 .circle2 {-webkit-animation-delay: -0.9s; animation-delay: -0.9s; } .component-container2 .circle2 {-webkit-animation-delay: -0.8s; animation-delay: -0.8s; } .component-container3 .circle2 {-webkit-animation-delay: -0.7s; animation-delay: -0.7s; } .component-container1 .circle3 {-webkit-animation-delay: -0.6s; animation-delay: -0.6s; } .component-container2 .circle3 {-webkit-animation-delay: -0.5s; animation-delay: -0.5s; } .component-container3 .circle3 {-webkit-animation-delay: -0.4s; animation-delay: -0.4s; } .component-container1 .circle4 {-webkit-animation-delay: -0.3s; animation-delay: -0.3s; } .component-container2 .circle4 {-webkit-animation-delay: -0.2s; animation-delay: -0.2s; } .component-container3 .circle4 {-webkit-animation-delay: -0.1s; animation-delay: -0.1s; } @-webkit-keyframes bouncedelay {0%, 80%, 100% { -webkit-transform: scale(0.0) } 40% { -webkit-transform: scale(1.0) } } @keyframes bouncedelay {0%, 80%, 100% {transform: scale(0.0); -webkit-transform: scale(0.0); } 40% {transform: scale(1.0); -webkit-transform: scale(1.0); } }';
        var head = document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = loadingStyle;
        } else {
            style.appendChild(document.createTextNode(loadingStyle));
        }

        head.appendChild(style);
    }
}]);
