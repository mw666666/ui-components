ui-components
==================
基于requirejs
angular组件式开发，按需加载组件, 根据组件延迟加载

使用ui-component自动加载相关组件的controller、template、directive、等
配合ng-router或ui-router, 只需要把模板改成&lt;div ui-component="xxx/XXX" ui-loading&gt;&lt;/div&gt;
```
ui-component 		是requirejs  define的模块，返回必须是函数

ui-loading			显示loading动画(组件加载完成前)
```

用法
-----
页面或模板
```html
	<h2>登录组件</h2>
	<div ui-component="user/Login"></div>

	<h2>用户列表组件</h2>
	<div ui-component="user/UserList" ui-loading></div>


```	
js调用
```js
	var app = angular.module('app', ['ui-components']);
	angular.bootstrap(document.body, ['app']);
```
