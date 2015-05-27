ui-components
==================
基于requirejs
angular组件式开发，按需加载组件, 根据组件延迟加载

使用ui-component自动加载组件(组件有controller、template、directive等)

配合ng-router或ui-router, 只需要把模板改成&lt;div ui-component="xxx/XXX" ui-loading&gt;&lt;/div&gt;
```
ui-component 		是requirejs  define的模块，返回必须是函数

ui-loading			显示loading动画(组件加载完成前)
```

用法
-----
**1.引入ui-components.js文件**

**2.页面或模板**
```html
	<h2>登录组件</h2>
	<div ui-component="user/Login"></div>

	<h2>用户列表组件</h2>
	<div ui-component="user/UserList" ui-loading></div>


```	
**3.js调用**
```js
	var app = angular.module('app', ['ui-components']);
	angular.bootstrap(document.body, ['app']);
```

Demo
-----
sdemo/index.html


更多demo 请访问<a href="http://sdemos.duapp.com/">SDemo</a> (<a href="http://sdemos.duapp.com/">www.sdemo.cn</a>)
-----
