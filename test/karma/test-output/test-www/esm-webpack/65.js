(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[65],{

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listen_jsx_root", function() { return AttributeBasicRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var AttributeBasicRoot = /** @class */ function() {
  function AttributeBasicRoot(t) {
    var i = this;
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.onClick = function() {
      i.wasClicked = "Parent event";
    }, this.wasClicked = "";
  }
  return AttributeBasicRoot.prototype.render = function() {
    return [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("span", {
      id: "result-root"
    }, this.wasClicked), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("listen-jsx", {
      onClick: this.onClick
    }) ];
  }, AttributeBasicRoot;
}();



/***/ })

}]);