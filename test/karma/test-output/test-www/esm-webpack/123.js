(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[123],{

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "slotted_css", function() { return SlottedCss; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var cmpCss = ':host{display:-ms-inline-flexbox;display:inline-flex;border:2px dashed gray;padding:2px}.content ::slotted(*){background-color:rgb(0, 255, 0)}::slotted(:not([slot="header-slot-name"])){border:4px solid rgb(0, 0, 255);color:rgb(0, 0, 255);font-weight:bold}::slotted([slot="header-slot-name"]){border:4px solid rgb(255, 0, 0);color:rgb(255, 0, 0);font-weight:bold}::slotted(*){margin:8px;padding:8px}', SlottedCss = /** @class */ function() {
  function SlottedCss(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t);
  }
  return SlottedCss.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "f"], null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("section", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("header", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot", {
      name: "header-slot-name"
    })), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("section", {
      class: "content"
    }, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot", null)), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("footer", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("slot", {
      name: "footer-slot-name"
    }))));
  }, SlottedCss;
}();

SlottedCss.style = cmpCss;



/***/ })

}]);