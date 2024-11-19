(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[63],{

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lifecycle_update_b", function() { return LifecycleUpdateB; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var LifecycleUpdateB = /** @class */ function() {
  function LifecycleUpdateB(e) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, e), this.value = 0;
  }
  return LifecycleUpdateB.prototype.componentWillLoad = function() {
    this.start = Date.now();
    var e = document.createElement("li");
    return e.innerHTML = '<span style="color:red">lifecycle-update-b</span> <span style="color:blue">componentWillLoad</span> '.concat(this.value), 
    document.getElementById("output").appendChild(e), new Promise((function(e) {
      setTimeout(e, 20);
    }));
  }, LifecycleUpdateB.prototype.componentDidLoad = function() {
    var e = document.createElement("li");
    e.innerHTML = '<span style="color:red">lifecycle-update-b</span> <span style="color:green">componentDidLoad</span> '.concat(this.value), 
    document.getElementById("output").appendChild(e);
  }, LifecycleUpdateB.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("section", null, "lifecycle-update-b: ", this.value, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("lifecycle-update-c", {
      value: this.value
    }));
  }, LifecycleUpdateB;
}();



/***/ })

}]);