(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[62],{

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_update_a", function() { return LifecycleUpdateA; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var LifecycleUpdateA = /** @class */ function() {
  function LifecycleUpdateA(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.values = [];
  }
  return LifecycleUpdateA.prototype.testClick = function() {
    this.values.push(this.values.length + 1), this.values = this.values.slice();
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:gray">async add child components to lifecycle-update-a</span> '.concat(this.values[this.values.length - 1]), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateA.prototype.componentWillLoad = function() {
    var e = document.createElement("li");
    return e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:blue">componentWillLoad</span>', 
    document.getElementById("output").appendChild(e), new Promise((function(e) {
      setTimeout(e, 10);
    }));
  }, LifecycleUpdateA.prototype.componentDidLoad = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:green">componentDidLoad</span>', 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateA.prototype.componentWillUpdate = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:cyan">componentWillUpdate</span> '.concat(this.values[this.values.length - 1]), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateA.prototype.componentDidUpdate = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:maroon">lifecycle-update-a</span> <span style="color:limegreen">componentDidUpdate</span> '.concat(this.values[this.values.length - 1]), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateA.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this),
      class: "test"
    }, "Add Child Components"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("hr", null), this.values.map((function(e) {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("lifecycle-update-b", {
        value: e
      });
    })));
  }, LifecycleUpdateA;
}();



/***/ })

}]);