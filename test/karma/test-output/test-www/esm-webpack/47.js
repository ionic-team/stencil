(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[47],{

/***/ 39:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "event_custom_type", function() { return EventCustomType; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var EventCustomType = /** @class */ function() {
  function EventCustomType(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.testEvent = Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* f */ "g"])(this, "testEvent", 7), this.counter = 0, 
    this.lastEventValue = void 0;
  }
  return EventCustomType.prototype.testEventHandler = function(t) {
    this.counter++, this.lastEventValue = t.detail;
  }, EventCustomType.prototype.componentDidLoad = function() {
    this.testEvent.emit({
      value: "Test value"
    });
  }, EventCustomType.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "testEvent is emitted on componentDidLoad"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "Emission count: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "counter"
    }, this.counter)), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("p", null, "Last emitted value: ", Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "lastValue"
    }, JSON.stringify(this.lastEventValue)))));
  }, EventCustomType;
}();



/***/ })

}]);