(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[56],{

/***/ 53:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_basic_a", function() { return LifecycleBasicA; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
var __spreadArray = undefined && undefined.__spreadArray || function(e, t, a) {
  if (a || 2 === arguments.length) for (var i, s = 0, c = t.length; s < c; s++) !i && s in t || (i || (i = Array.prototype.slice.call(t, 0, s)), 
  i[s] = t[s]);
  return e.concat(i || Array.prototype.slice.call(t));
};



var LifecycleBasicA = /** @class */ function() {
  function LifecycleBasicA(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.componentWillUpdated = !1, this.componentDidUpdated = !1, 
    this.value = "", this.rendered = 0, this.loads = [], this.updates = [];
  }
  return LifecycleBasicA.prototype.lifecycleLoad = function(e) {
    this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ e.detail ], !1);
  }, LifecycleBasicA.prototype.lifecycleUpdate = function(e) {
    this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ e.detail ], !1);
  }, LifecycleBasicA.prototype.componentWillLoad = function() {
    this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ "componentWillLoad-a" ], !1);
  }, LifecycleBasicA.prototype.componentDidLoad = function() {
    this.loads = __spreadArray(__spreadArray([], this.loads, !0), [ "componentDidLoad-a" ], !1);
  }, LifecycleBasicA.prototype.componentWillUpdate = function() {
    "Updated" !== this.value || this.componentWillUpdated || (this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ "componentWillUpdate-a" ], !1), 
    this.componentWillUpdated = !0);
  }, LifecycleBasicA.prototype.componentDidUpdate = function() {
    "Updated" !== this.value || this.componentDidUpdated || (this.updates = __spreadArray(__spreadArray([], this.updates, !0), [ "componentDidUpdate-a" ], !1), 
    this.componentDidUpdated = !0);
  }, LifecycleBasicA.prototype.testClick = function() {
    this.value = "Updated";
  }, LifecycleBasicA.prototype.render = function() {
    return this.rendered++, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Update"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("hr", null), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "LifecycleBasicA ", this.value), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "rendered-a"
    }, "rendered a: ", this.rendered), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "loads a:"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("ol", {
      class: "lifecycle-loads-a"
    }, this.loads.map((function(e) {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("li", null, e);
    }))), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "updates a:"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("ol", {
      class: "lifecycle-updates-a"
    }, this.updates.map((function(e) {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("li", null, e);
    }))), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("lifecycle-basic-b", {
      value: this.value
    }));
  }, LifecycleBasicA;
}();



/***/ })

}]);