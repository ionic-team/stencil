(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[46],{

/***/ 38:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "event_basic", function() { return EventBasic; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var EventBasic = /** @class */ function() {
  function EventBasic(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.testEvent = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* f */ "g"])(this, "testEvent", 7), this.counter = 0;
  }
  return EventBasic.prototype.testEventHandler = function() {
    this.counter++;
  }, EventBasic.prototype.componentDidLoad = function() {
    this.testEvent.emit();
  }, EventBasic.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "testEvent is emitted on componentDidLoad"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "Emission count: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "counter"
    }, this.counter))));
  }, EventBasic;
}();



/***/ })

}]);