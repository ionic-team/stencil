(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],{

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

/***/ 137:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return store; });
/* harmony import */ var _external_data_e83150db_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(134);


function store() {
  return {
    data: Object(_external_data_e83150db_js__WEBPACK_IMPORTED_MODULE_0__[/* d */ "a"])()
  };
}



/***/ }),

/***/ 41:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "external_import_b", function() { return ExternalImportB; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
/* harmony import */ var _external_store_9286228d_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(137);
/* harmony import */ var _external_data_e83150db_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(134);






var ExternalImportB = /** @class */ function() {
  function ExternalImportB(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t);
  }
  return ExternalImportB.prototype.componentWillLoad = function() {
    var t = Object(_external_store_9286228d_js__WEBPACK_IMPORTED_MODULE_1__[/* s */ "a"])().data;
    this.first = t.first, this.last = t.last;
  }, ExternalImportB.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, this.first, " ", this.last);
  }, ExternalImportB;
}();



/***/ })

}]);