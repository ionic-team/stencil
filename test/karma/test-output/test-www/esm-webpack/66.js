(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[66],{

/***/ 66:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listen_jsx", function() { return AttributeBasic; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var AttributeBasic = /** @class */ function() {
  function AttributeBasic(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.wasClicked = "";
  }
  return AttributeBasic.prototype.onClick = function() {
    this.wasClicked = "Host event";
  }, AttributeBasic.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "result"
    }, this.wasClicked);
  }, AttributeBasic;
}();

AttributeBasic.style = ".sc-listen-jsx-h{\n    background: black;\n    display: block;\n    color: white;\n    width: 100px;\n    height: 100px;\n  }";



/***/ })

}]);