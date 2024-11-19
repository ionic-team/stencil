(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[10],{

/***/ 2:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attribute_basic_root", function() { return AttributeBasicRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var AttributeBasicRoot = /** @class */ function() {
  function AttributeBasicRoot(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t);
  }
  return AttributeBasicRoot.prototype.componentWillLoad = function() {
    this.url = new URL(window.location.href);
  }, AttributeBasicRoot.prototype.testClick = function() {
    var t = this.el.querySelector("attribute-basic");
    t.setAttribute("single", "single-update"), t.setAttribute("multi-word", "multiWord-update"), 
    t.setAttribute("my-custom-attr", "my-custom-attr-update"), t.setAttribute("getter", "getter-update");
  }, AttributeBasicRoot.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this)
    }, "Test"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("attribute-basic", null), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "hostname: ", this.url.hostname, ", pathname: ", this.url.pathname));
  }, Object.defineProperty(AttributeBasicRoot.prototype, "el", {
    get: function() {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* g */ "h"])(this);
    },
    enumerable: !1,
    configurable: !0
  }), AttributeBasicRoot;
}();



/***/ })

}]);