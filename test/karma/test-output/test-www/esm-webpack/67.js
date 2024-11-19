(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[67],{

/***/ 67:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listen_reattach", function() { return ListenReattach; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ListenReattach = /** @class */ function() {
  function ListenReattach(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.clicked = 0;
  }
  return ListenReattach.prototype.click = function() {
    this.clicked++;
  }, ListenReattach.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "f"], null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      id: "clicked"
    }, "Clicked: ", this.clicked));
  }, ListenReattach;
}();

ListenReattach.style = ".sc-listen-reattach-h { display: block; background: gray;}";



/***/ })

}]);