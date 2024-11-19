(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[41],{

/***/ 33:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "dom_reattach", function() { return DomReattach; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var DomReattach = /** @class */ function() {
  function DomReattach(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.willLoad = 0, this.didLoad = 0, this.didUnload = 0;
  }
  return DomReattach.prototype.componentWillLoad = function() {
    this.willLoad++;
  }, DomReattach.prototype.componentDidLoad = function() {
    this.didLoad++;
  }, DomReattach.prototype.disconnectedCallback = function() {
    this.didUnload++;
  }, DomReattach.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "f"], null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "componentWillLoad: ", this.willLoad), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "componentDidLoad: ", this.didLoad), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "disconnectedCallback: ", this.didUnload));
  }, DomReattach;
}();



/***/ })

}]);