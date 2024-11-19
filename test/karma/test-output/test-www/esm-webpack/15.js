(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[15],{

/***/ 7:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "attribute_host", function() { return AttributeHost; });
/* harmony import */ var _index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);


var AttributeHost = /** @class */ function() {
  function AttributeHost(t) {
    Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* r */ "l"])(this, t), this.attrsAdded = !1;
  }
  return AttributeHost.prototype.testClick = function() {
    this.attrsAdded = !this.attrsAdded;
  }, AttributeHost.prototype.render = function() {
    var t = {};
    return this.attrsAdded ? (t.color = "lime", t.content = "attributes added", t.padding = !0, 
    t.margin = "", t.bold = "true", t["no-attr"] = null) : (t.content = "attributes removed", 
    t.padding = !1, t.bold = "false", t["no-attr"] = null), [ Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("button", {
      onClick: this.testClick.bind(this)
    }, this.attrsAdded ? "Remove" : "Add", " Attributes"), Object(_index_a2c0d171_js__WEBPACK_IMPORTED_MODULE_0__[/* h */ "i"])("section", Object.assign({}, t, {
      style: {
        "border-color": this.attrsAdded ? "black" : "",
        display: this.attrsAdded ? "block" : "inline-block",
        fontSize: this.attrsAdded ? "24px" : "",
        "--css-var": this.attrsAdded ? "12" : ""
      }
    })) ];
  }, AttributeHost;
}();

AttributeHost.style = "[color=lime] {\n      background: lime;\n    }\n    section::before {\n      content: attr(content);\n    }\n    [padding=true] {\n      padding: 50px;\n    }\n    [margin] {\n      margin: 50px;\n    }\n    [bold=true] {\n      font-weight: bold;\n    }";



/***/ })

}]);