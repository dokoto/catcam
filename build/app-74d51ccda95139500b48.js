webpackJsonp([0],{

/***/ "../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/index.js!../../node_modules/sass-loader/lib/loader.js?sourceMap!./modules/root/styles/root.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../node_modules/css-loader/lib/css-base.js")(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),

/***/ "./app.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("../../node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom__ = __webpack_require__("../../node_modules/react-dom/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hot_loader__ = __webpack_require__("../../node_modules/react-hot-loader/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_hot_loader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_hot_loader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_root_root_container__ = __webpack_require__("./modules/root/root.container.jsx");





var render = function render(Component) {
  __WEBPACK_IMPORTED_MODULE_1_react_dom__["ReactDOM"].render(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_2_react_hot_loader__["AppContainer"],
    null,
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(Component, null)
  ), document.getElementById('root'));
};

render(__WEBPACK_IMPORTED_MODULE_3__modules_root_root_container__["default"]);

if (true) {
  module.hot.accept("./modules/root/root.container.jsx", function(__WEBPACK_OUTDATED_DEPENDENCIES__) { /* harmony import */ __WEBPACK_IMPORTED_MODULE_3__modules_root_root_container__ = __webpack_require__("./modules/root/root.container.jsx"); (function () {
    return render(__WEBPACK_IMPORTED_MODULE_3__modules_root_root_container__["default"]);
  })(__WEBPACK_OUTDATED_DEPENDENCIES__); });
}

/***/ }),

/***/ "./modules/root/components/about.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("../../node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);


var About = function About() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    "div",
    null,
    "Hey! Thanks for using this example. If you like it, consider starring the repo :))",
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      "div",
      null,
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("iframe", { src: "https://ghbtns.com/github-btn.html?user=jpsierens&repo=webpack-react-redux&type=star&size=large", frameBorder: "0", allowTransparency: "true", scrolling: "0" })
    )
  );
};

/* harmony default export */ __webpack_exports__["a"] = (About);

/***/ }),

/***/ "./modules/root/components/app.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("../../node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__("../../node_modules/react-router/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__styles_root_scss__ = __webpack_require__("./modules/root/styles/root.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__styles_root_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__styles_root_scss__);




var App = function App() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    'div',
    { className: __WEBPACK_IMPORTED_MODULE_2__styles_root_scss__["container"] },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'footer',
      { className: __WEBPACK_IMPORTED_MODULE_2__styles_root_scss__["footer"] },
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
        __WEBPACK_IMPORTED_MODULE_1_react_router__["Link"],
        { to: '/about' },
        'About'
      )
    )
  );
};

/* harmony default export */ __webpack_exports__["a"] = (App);

/***/ }),

/***/ "./modules/root/devtools.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("../../node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_devtools__ = __webpack_require__("../../node_modules/redux-devtools/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_devtools___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_devtools__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_devtools_log_monitor__ = __webpack_require__("../../node_modules/redux-devtools-log-monitor/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_redux_devtools_log_monitor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_redux_devtools_log_monitor__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_redux_devtools_dock_monitor__ = __webpack_require__("../../node_modules/redux-devtools-dock-monitor/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_redux_devtools_dock_monitor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_redux_devtools_dock_monitor__);





/* harmony default export */ __webpack_exports__["a"] = (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_redux_devtools__["createDevTools"])(__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_3_redux_devtools_dock_monitor___default.a,
  { toggleVisibilityKey: 'ctrl-h', changePositionKey: 'ctrl-w' },
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_redux_devtools_log_monitor___default.a, null)
)));

/***/ }),

/***/ "./modules/root/root.container.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("../../node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__("../../node_modules/react-redux/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__("../../node_modules/react-router/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__devtools__ = __webpack_require__("./modules/root/devtools.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__root_routes__ = __webpack_require__("./modules/root/root.routes.jsx");
var _this = this;







var Root = function Root() {
  return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
    __WEBPACK_IMPORTED_MODULE_1_react_redux__["Provider"],
    { store: _this.props.store },
    __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
      'div',
      null,
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_2_react_router__["a" /* Router */], { history: _this.props.history, routes: __WEBPACK_IMPORTED_MODULE_4__root_routes__["a" /* default */] }),
      __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_3__devtools__["a" /* default */], null)
    )
  );
};

/* harmony default export */ __webpack_exports__["default"] = (Root);

/***/ }),

/***/ "./modules/root/root.routes.jsx":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__("../../node_modules/react/react.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__("../../node_modules/react-router/es/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_app__ = __webpack_require__("./modules/root/components/app.jsx");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_about__ = __webpack_require__("./modules/root/components/about.jsx");





/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(
  __WEBPACK_IMPORTED_MODULE_1_react_router__["b" /* Route */],
  { path: '/', component: __WEBPACK_IMPORTED_MODULE_2__components_app__["a" /* default */] },
  __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement(__WEBPACK_IMPORTED_MODULE_1_react_router__["b" /* Route */], { path: '/about', component: __WEBPACK_IMPORTED_MODULE_3__components_about__["a" /* default */] })
));

/***/ }),

/***/ "./modules/root/styles/root.scss":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/index.js!../../node_modules/sass-loader/lib/loader.js?sourceMap!./modules/root/styles/root.scss");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("../../node_modules/style-loader/addStyles.js")(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(true) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/index.js!../../node_modules/sass-loader/lib/loader.js?sourceMap!./modules/root/styles/root.scss", function() {
			var newContent = __webpack_require__("../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/index.js!../../node_modules/sass-loader/lib/loader.js?sourceMap!./modules/root/styles/root.scss");
			if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ })

},["./app.js"]);
//# sourceMappingURL=app-74d51ccda95139500b48.js.map