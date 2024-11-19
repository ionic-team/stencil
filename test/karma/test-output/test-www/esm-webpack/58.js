(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[58],{

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_basic_c", function() { return LifecycleBasicC; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var LifecycleBasicC = /** @class */ function() {
  function LifecycleBasicC(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.lifecycleLoad = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* f */ "g"])(this, "lifecycleLoad", 7), 
    this.lifecycleUpdate = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* f */ "g"])(this, "lifecycleUpdate", 7), this.value = "", 
    this.rendered = 0;
  }
  return LifecycleBasicC.prototype.componentWillLoad = function() {
    this.lifecycleLoad.emit("componentWillLoad-c");
  }, LifecycleBasicC.prototype.componentDidLoad = function() {
    this.lifecycleLoad.emit("componentDidLoad-c");
  }, LifecycleBasicC.prototype.componentWillUpdate = function() {
    this.lifecycleUpdate.emit("componentWillUpdate-c");
  }, LifecycleBasicC.prototype.componentDidUpdate = function() {
    this.lifecycleUpdate.emit("componentDidUpdate-c");
  }, LifecycleBasicC.prototype.render = function() {
    return this.rendered++, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("hr", null), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "LifecycleBasicC ", this.value), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "rendered-c"
    }, "rendered c: ", this.rendered));
  }, LifecycleBasicC;
}();



/***/ })

}]);