(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[126],{

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "svg_attr", function() { return SvgAttr; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var SvgAttr = /** @class */ function() {
  function SvgAttr(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.isOpen = !1;
  }
  return SvgAttr.prototype.testClick = function() {
    this.isOpen = !this.isOpen;
  }, SvgAttr.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this)
    }, "Test")), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, this.isOpen ? Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("svg", {
      viewBox: "0 0 54 54"
    }, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("rect", {
      transform: "rotate(45 27 27)",
      y: "22",
      width: "54",
      height: "10",
      rx: "2",
      stroke: "yellow",
      "stroke-width": "5px",
      "stroke-dasharray": "8 4"
    })) : Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("svg", {
      viewBox: "0 0 54 54"
    }, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("rect", {
      y: "0",
      width: "54",
      height: "10",
      rx: "2",
      stroke: "blue",
      "stroke-width": "2px",
      "stroke-dasharray": "4 2"
    }))));
  }, SvgAttr;
}();



/***/ })

}]);