(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[64],{

/***/ 64:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_update_c", function() { return LifecycleUpdateC; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var LifecycleUpdateC = /** @class */ function() {
  function LifecycleUpdateC(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.value = 0;
  }
  return LifecycleUpdateC.prototype.componentWillLoad = function() {
    this.start = Date.now();
    var e = document.createElement("li");
    return e.innerHTML = '<span style="color:orange">lifecycle-update-c</span> <span style="color:blue">componentWillLoad</span> '.concat(this.value), 
    document.getElementById("output").appendChild(e), new Promise((function(e) {
      setTimeout(e, 30);
    }));
  }, LifecycleUpdateC.prototype.componentDidLoad = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:orange">lifecycle-update-c</span> <span style="color:green">componentDidLoad</span> '.concat(this.value), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateC.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", null, " - lifecycle-update-c: ", this.value);
  }, LifecycleUpdateC;
}();



/***/ })

}]);