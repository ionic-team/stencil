(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return data; });
function data() {
  return {
    first: "Marty",
    last: "McFly"
  };
}



/***/ }),

/***/ 42:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "external_import_c", function() { return ExternalImportB; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _external_data_e83150db_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(134);




var ExternalImportB = /** @class */ function() {
  function ExternalImportB(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t);
  }
  return ExternalImportB.prototype.componentWillLoad = function() {
    this.first = Object(_external_data_e83150db_js__WEBPACK_IMPORTED_MODULE_1__[/* d */ "a"])().first, this.last = Object(_external_data_e83150db_js__WEBPACK_IMPORTED_MODULE_1__[/* d */ "a"])().last;
  }, ExternalImportB.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, this.first, " ", this.last);
  }, ExternalImportB;
}();



/***/ })

}]);