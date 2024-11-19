(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[50],{

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init_css_root", function() { return InitCssRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var cmpRootCss = 'div#relativeToRoot{background-image:url("/assets/favicon.ico?relativeToRoot")}div#relative{background-image:url("../assets/favicon.ico?relative")}div#absolute{background-image:url("https://www.google.com/favicon.ico")}', InitCssRoot = /** @class */ function() {
  function InitCssRoot(o) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, o);
  }
  return InitCssRoot.prototype.render = function() {
    return [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      id: "relative"
    }), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      id: "relativeToRoot"
    }), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      id: "absolute"
    }) ];
  }, InitCssRoot;
}();

InitCssRoot.style = cmpRootCss;



/***/ })

}]);