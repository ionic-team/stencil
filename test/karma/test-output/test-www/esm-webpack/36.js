(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[36],{

/***/ 28:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "custom_event_root", function() { return CustomEventCmp; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var CustomEventCmp = /** @class */ function() {
  function CustomEventCmp(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.output = "";
  }
  return CustomEventCmp.prototype.componentDidLoad = function() {
    this.elm.addEventListener("eventNoDetail", this.receiveEvent.bind(this)), this.elm.addEventListener("eventWithDetail", this.receiveEvent.bind(this));
  }, CustomEventCmp.prototype.receiveEvent = function(t) {
    this.output = "".concat(t.type, " ").concat(t.detail || "").trim();
  }, CustomEventCmp.prototype.fireCustomEventNoDetail = function() {
    var t = new CustomEvent("eventNoDetail");
    this.elm.dispatchEvent(t);
  }, CustomEventCmp.prototype.fireCustomEventWithDetail = function() {
    var t = new CustomEvent("eventWithDetail", {
      detail: 88
    });
    this.elm.dispatchEvent(t);
  }, CustomEventCmp.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      id: "btnNoDetail",
      onClick: this.fireCustomEventNoDetail.bind(this)
    }, "Fire Custom Event, no detail")), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      id: "btnWithDetail",
      onClick: this.fireCustomEventWithDetail.bind(this)
    }, "Fire Custom Event, with detail")), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("pre", {
      id: "output"
    }, this.output));
  }, Object.defineProperty(CustomEventCmp.prototype, "elm", {
    get: function() {
      return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* g */ "h"])(this);
    },
    enumerable: !1,
    configurable: !0
  }), CustomEventCmp;
}();



/***/ })

}]);