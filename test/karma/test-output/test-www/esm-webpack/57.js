(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[57],{

/***/ 54:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_basic_b", function() { return LifecycleBasicB; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var LifecycleBasicB = /** @class */ function() {
  function LifecycleBasicB(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.lifecycleLoad = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* f */ "g"])(this, "lifecycleLoad", 7), 
    this.lifecycleUpdate = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* f */ "g"])(this, "lifecycleUpdate", 7), this.value = "", 
    this.rendered = 0;
  }
  return LifecycleBasicB.prototype.componentWillLoad = function() {
    this.lifecycleLoad.emit("componentWillLoad-b");
  }, LifecycleBasicB.prototype.componentDidLoad = function() {
    this.lifecycleLoad.emit("componentDidLoad-b");
  }, LifecycleBasicB.prototype.componentWillUpdate = function() {
    this.lifecycleUpdate.emit("componentWillUpdate-b");
  }, LifecycleBasicB.prototype.componentDidUpdate = function() {
    this.lifecycleUpdate.emit("componentDidUpdate-b");
  }, LifecycleBasicB.prototype.render = function() {
    return this.rendered++, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("hr", null), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "LifecycleBasicB ", this.value), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "rendered-b"
    }, "rendered b: ", this.rendered), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("lifecycle-basic-c", {
      value: this.value
    }));
  }, LifecycleBasicB;
}();



/***/ })

}]);