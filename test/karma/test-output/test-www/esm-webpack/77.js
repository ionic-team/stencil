(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[77],{

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "reparent_style_with_vars", function() { return ReparentStyleWithVars; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var reparentStyleWithVarsCss = ":root{--custom-color:blue}:host{background-color:var(--custom-color, blue);display:block;padding:2em}.css-entry{color:purple;font-weight:bold}", ReparentStyleWithVars = /** @class */ function() {
  function ReparentStyleWithVars(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t);
  }
  return ReparentStyleWithVars.prototype.render = function() {
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "css-entry"
    }, "With CSS Vars");
  }, ReparentStyleWithVars;
}();

ReparentStyleWithVars.style = reparentStyleWithVarsCss;



/***/ })

}]);