import { attachShadow, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const stylusEntryCss = ".stylus-importee{color:#008000;font-weight:bold}.stylus-importee::after{content:': from stylus-importee.styl'}hr{height:100px;background-color:red}.css-importee{color:blue;font-weight:bold}.css-importee::after{content:': from css-importee.css'}/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%;}body{margin:0}main{display:block}h1{font-size:2em;margin:0.67em 0}hr{-webkit-box-sizing:content-box;box-sizing:content-box;height:0;overflow:visible;}pre{font-family:monospace, monospace;font-size:1em;}a{background-color:transparent}abbr[title]{border-bottom:none;text-decoration:underline;-webkit-text-decoration:underline dotted;text-decoration:underline dotted;}b,strong{font-weight:bolder}code,kbd,samp{font-family:monospace, monospace;font-size:1em;}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-0.25em}sup{top:-0.5em}img{border-style:none}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;line-height:1.15;margin:0;}button,input{overflow:visible}button,select{text-transform:none}button,[type=\"button\"],[type=\"reset\"],[type=\"submit\"]{-webkit-appearance:button}button::-moz-focus-inner,[type=\"button\"]::-moz-focus-inner,[type=\"reset\"]::-moz-focus-inner,[type=\"submit\"]::-moz-focus-inner{border-style:none;padding:0}button:-moz-focusring,[type=\"button\"]:-moz-focusring,[type=\"reset\"]:-moz-focusring,[type=\"submit\"]:-moz-focusring{outline:1px dotted ButtonText}fieldset{padding:0.35em 0.75em 0.625em}legend{-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;display:table;max-width:100%;padding:0;white-space:normal;}progress{vertical-align:baseline}textarea{overflow:auto}[type=\"checkbox\"],[type=\"radio\"]{-webkit-box-sizing:border-box;box-sizing:border-box;padding:0;}[type=\"number\"]::-webkit-inner-spin-button,[type=\"number\"]::-webkit-outer-spin-button{height:auto}[type=\"search\"]{-webkit-appearance:textfield;outline-offset:-2px;}[type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit;}details{display:block}summary{display:list-item}template{display:none}[hidden]{display:none}.stylus-entry{color:#f00;font-weight:bold}.stylus-entry::after{content:': from stylus-entry.style'}";

const StylusCmp$1 = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
  }
  render() {
    return (h(Host, null, h("div", { class: "stylus-entry" }, "Stylus Entry"), h("div", { class: "stylus-importee" }, "Stylus Importee"), h("div", { class: "css-importee" }, "Css Importee"), h("hr", null)));
  }
  static get style() { return stylusEntryCss; }
};

const StylusCmp = /*@__PURE__*/proxyCustomElement(StylusCmp$1, [1,"stylus-cmp"]);
const components = ['stylus-cmp', ];

const defineCustomElement = (tagRename) => {
  let tagName;
  components.forEach(cmp => {
    switch(cmp) {

      case 'stylus-cmp':
        tagName = 'stylus-cmp';
        if (tagRename) {
          tagName = tagRename(tagName);
        }
        if (!customElements.get(tagName)) {
          
          customElements.define(tagName, StylusCmp);
        }
        break;

    }
  });
};

export { StylusCmp, defineCustomElement };
