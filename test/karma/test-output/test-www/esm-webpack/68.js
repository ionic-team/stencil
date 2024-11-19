(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[68],{

/***/ 68:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "listen_window", function() { return ListenWindow; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var ListenWindow = /** @class */ function() {
  function ListenWindow(i) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, i), this.clicked = 0, this.scrolled = 0;
  }
  return ListenWindow.prototype.winClick = function() {
    this.clicked++;
  }, ListenWindow.prototype.winScroll = function() {
    this.scrolled++;
  }, ListenWindow.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      id: "clicked"
    }, "Clicked: ", this.clicked), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", null, "Scrolled: ", this.scrolled), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", null, "Click!"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      style: {
        background: "gray",
        paddingTop: "2000px"
      }
    }));
  }, ListenWindow;
}();



/***/ })

}]);