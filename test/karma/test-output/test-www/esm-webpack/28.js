(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[28],{

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "css_variables_shadow_dom", function() { return CssVariablesRoot; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var cmpShadowDomCss = ":host{--color:blue;--background:red}:host(.set-green){--background:green}.inner-div{background:var(--background);color:var(--color)}.black-global-shadow{background:var(--global-background);color:var(--global-color);font-weight:var(--font-weight)}", CssVariablesRoot = /** @class */ function() {
  function CssVariablesRoot(o) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, o), this.isGreen = !1;
  }
  return CssVariablesRoot.prototype.render = function() {
    var o = this;
    return Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* e */ "f"], {
      class: {
        "set-green": this.isGreen
      }
    }, Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "inner-div"
    }, "Shadow: ", this.isGreen ? "Green" : "Red", " background"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("div", {
      class: "black-global-shadow"
    }, "Shadow: Black background (global)"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: function() {
        o.isGreen = !o.isGreen;
      }
    }, "Toggle color"));
  }, CssVariablesRoot;
}();

CssVariablesRoot.style = cmpShadowDomCss;



/***/ })

}]);