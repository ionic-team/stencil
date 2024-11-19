System.register([ "./p-329d5583.system.js", "./p-c39c04a6.system.js" ], (function(e, t) {
  "use strict";
  var s, a, o, c, l, r, d, n;
  return {
    setters: [ function(t) {
      s = t.p, a = t.w, o = t.d, c = t.N, l = t.a, r = t.H, d = t.b, e("setNonce", t.s);
    }, function(e) {
      n = e.g;
    } ],
    execute: function() {
      var patchDynamicImport = function(e, t) {
        var l = "__sc_import_".concat(c.replace(/\s|-/g, "_"));
        try {
          // test if this browser supports dynamic imports
          // There is a caching issue in V8, that breaks using import() in Function
          // By generating a random string, we can workaround it
          // Check https://bugs.chromium.org/p/chromium/issues/detail?id=990810 for more info
          a[l] = new Function("w", "return import(w);//".concat(Math.random()));
        } catch (d) {
          // this shim is specifically for browsers that do support "esm" imports
          // however, they do NOT support "dynamic" imports
          // basically this code is for old Edge, v18 and below
          var r = new Map;
          a[l] = function(c) {
            var d, n = new URL(c, e).href, m = r.get(n);
            if (!m) {
              var i = o.createElement("script");
              i.type = "module", i.crossOrigin = t.crossOrigin, i.src = URL.createObjectURL(new Blob([ "import * as m from '".concat(n, "'; window.").concat(l, ".m = m;") ], {
                type: "application/javascript"
              }));
              // Apply CSP nonce to the script tag if it exists
              var p = null !== (d = s.$nonce$) && void 0 !== d ? d : 
              /*
       Stencil Client Patch Browser v2.23.2 | MIT Licensed | https://stenciljs.com
       */
              /**
       * Helper method for querying a `meta` tag that contains a nonce value
       * out of a DOM's head.
       *
       * @param doc The DOM containing the `head` to query against
       * @returns The content of the meta tag representing the nonce value, or `undefined` if no tag
       * exists or the tag has no content.
       */
              function(e) {
                var t, s, a;
                return null !== (a = null === (s = null === (t = e.head) || void 0 === t ? void 0 : t.querySelector('meta[name="csp-nonce"]')) || void 0 === s ? void 0 : s.getAttribute("content")) && void 0 !== a ? a : void 0;
              }(o);
              null != p && i.setAttribute("nonce", p), m = new Promise((function(e) {
                i.onload = function() {
                  e(a[l].m), i.remove();
                };
              })), r.set(n, m), o.head.appendChild(i);
            }
            return m;
          };
        }
      }, patchCloneNodeFix = function(e) {
        var t = e.cloneNode;
        e.cloneNode = function(e) {
          if ("TEMPLATE" === this.nodeName) return t.call(this, e);
          var s = t.call(this, !1), a = this.childNodes;
          if (e) for (var o = 0; o < a.length; o++) 
          // Node.ATTRIBUTE_NODE === 2, and checking because IE11
          2 !== a[o].nodeType && s.appendChild(a[o].cloneNode(!0));
          return s;
        };
      };
      (function() {
        // shim css vars
        s.$cssShim$ = a.__cssshim, 
        // opted-in to polyfill cloneNode() for slot polyfilled components
        patchCloneNodeFix(r.prototype);
        // @ts-ignore
        var e = Array.from(o.querySelectorAll("script")).find((function(e) {
          return new RegExp("/".concat(c, "(\\.esm)?\\.js($|\\?|#)")).test(e.src) || e.getAttribute("data-stencil-namespace") === c;
        })), d = e["data-opts"] || {};
        return "onbeforeload" in e && !history.scrollRestoration /* IS_ESM_BUILD */ ? {
          then: function() {
            /* promise noop */}
        } : (d.resourcesUrl = new URL(".", new URL(e.getAttribute("data-resources-url") || e.src, a.location.href)).href, 
        patchDynamicImport(d.resourcesUrl, e), a.customElements ? l(d) : t.import(/* webpackChunkName: "polyfills-dom" */ "./p-0d7347ad.system.js").then((function() {
          return d;
        })));
      })().then((function(e) {
        return n(), d([ [ "p-849fee5d.system", [ [ 1, "custom-element-root" ] ] ], [ "p-2e5408f5.system", [ [ 0, "lifecycle-async-a", {
          value: [ 32 ],
          loads: [ 32 ],
          updates: [ 32 ]
        }, [ [ 0, "lifecycleLoad", "lifecycleLoad" ], [ 0, "lifecycleUpdate", "lifecycleUpdate" ] ] ] ] ], [ "p-8fd3bda2.system", [ [ 0, "lifecycle-basic-a", {
          value: [ 32 ],
          rendered: [ 32 ],
          loads: [ 32 ],
          updates: [ 32 ]
        }, [ [ 0, "lifecycleLoad", "lifecycleLoad" ], [ 0, "lifecycleUpdate", "lifecycleUpdate" ] ] ] ] ], [ "p-3e289e5b.system", [ [ 0, "lifecycle-unload-root", {
          renderCmp: [ 32 ]
        } ] ] ], [ "p-4ddb6f7f.system", [ [ 0, "lifecycle-update-a", {
          values: [ 32 ]
        } ] ] ], [ "p-54936b18.system", [ [ 0, "slot-list-light-root", {
          items: [ 1040 ]
        } ] ] ], [ "p-bcc1bec6.system", [ [ 0, "slot-list-light-scoped-root", {
          items: [ 1040 ]
        } ] ] ], [ "p-52121a8d.system", [ [ 0, "attribute-basic-root" ] ] ], [ "p-b3342cdc.system", [ [ 0, "conditional-rerender-root", {
          showContent: [ 32 ],
          showFooter: [ 32 ]
        } ] ] ], [ "p-de086605.system", [ [ 1, "custom-element-root-different-name-than-class" ] ] ], [ "p-c639607e.system", [ [ 0, "listen-jsx-root", {
          wasClicked: [ 32 ]
        } ] ] ], [ "p-dd82ccdf.system", [ [ 1, "parent-reflect-nan-attribute" ] ] ], [ "p-ea0c7fd1.system", [ [ 1, "parent-with-reflect-child" ] ] ], [ "p-1c891119.system", [ [ 34, "scoped-basic-root" ] ] ], [ "p-1ed8bee9.system", [ [ 0, "shadow-dom-array-root", {
          values: [ 32 ]
        } ] ] ], [ "p-9dfa07f7.system", [ [ 1, "shadow-dom-basic-root" ] ] ], [ "p-cb95a141.system", [ [ 0, "shadow-dom-mode-root", {
          showRed: [ 32 ]
        } ] ] ], [ "p-c026c6dc.system", [ [ 1, "shadow-dom-slot-nested-root" ] ] ], [ "p-aa7c02bd.system", [ [ 0, "slot-array-complex-root", {
          endSlot: [ 32 ]
        } ] ] ], [ "p-8fa30cad.system", [ [ 0, "slot-basic-order-root" ] ] ], [ "p-1b41a521.system", [ [ 0, "slot-basic-root", {
          inc: [ 32 ]
        } ] ] ], [ "p-c860cf9b.system", [ [ 0, "slot-dynamic-wrapper-root", {
          tag: [ 32 ]
        } ] ] ], [ "p-f03ff69c.system", [ [ 0, "slot-fallback-root", {
          fallbackInc: [ 32 ],
          inc: [ 32 ],
          slotContent: [ 32 ]
        } ] ] ], [ "p-7e8a8cbe.system", [ [ 0, "slot-light-dom-root", {
          a: [ 32 ],
          b: [ 32 ],
          c: [ 32 ],
          d: [ 32 ],
          e: [ 32 ],
          f: [ 32 ],
          g: [ 32 ],
          h: [ 32 ],
          i: [ 32 ],
          j: [ 32 ],
          k: [ 32 ],
          l: [ 32 ],
          m: [ 32 ]
        } ] ] ], [ "p-79866b9b.system", [ [ 0, "slot-map-order-root" ] ] ], [ "p-276b99eb.system", [ [ 4, "slot-nested-order-parent" ] ] ], [ "p-a489a26a.system", [ [ 0, "slot-reorder-root", {
          reordered: [ 32 ]
        } ] ] ], [ "p-2164619d.system", [ [ 0, "slot-replace-wrapper-root", {
          href: [ 32 ]
        } ] ] ], [ "p-1978d456.system", [ [ 0, "stencil-sibling" ] ] ], [ "p-6f6b860c.system", [ [ 6, "append-child" ] ] ], [ "p-2ee47320.system", [ [ 0, "attribute-boolean", {
          boolState: [ 516, "bool-state" ],
          strState: [ 513, "str-state" ],
          noreflect: [ 4 ]
        } ] ] ], [ "p-701a7000.system", [ [ 0, "attribute-boolean-root", {
          state: [ 32 ],
          toggleState: [ 64 ]
        } ] ] ], [ "p-4faa3ff8.system", [ [ 0, "attribute-complex", {
          nu0: [ 2, "nu-0" ],
          nu1: [ 2, "nu-1" ],
          nu2: [ 2, "nu-2" ],
          bool0: [ 4, "bool-0" ],
          bool1: [ 4, "bool-1" ],
          bool2: [ 4, "bool-2" ],
          str0: [ 1, "str-0" ],
          str1: [ 1, "str-1" ],
          str2: [ 1, "str-2" ],
          obj: [ 6145 ],
          getInstance: [ 64 ]
        } ] ] ], [ "p-936181a1.system", [ [ 0, "attribute-host", {
          attrsAdded: [ 32 ]
        } ] ] ], [ "p-ec14d9c4.system", [ [ 0, "attribute-html-root", {
          strAttr: [ 1, "str-attr" ],
          anyAttr: [ 8, "any-attr" ],
          nuAttr: [ 2, "nu-attr" ]
        } ] ] ], [ "p-a5e652d3.system", [ [ 0, "bad-shared-jsx" ] ] ], [ "p-0f5b06ec.system", [ [ 0, "build-data" ] ] ], [ "p-4cc78a62.system", [ [ 6, "cmp-label" ] ] ], [ "p-6858d5ae.system", [ [ 6, "cmp-label-with-slot-sibling" ] ] ], [ "p-9cfb4d5c.system", [ [ 0, "conditional-basic", {
          showContent: [ 32 ]
        } ] ] ], [ "p-2998b272.system", [ [ 1, "css-cmp" ] ] ], [ "p-35c31fc3.system", [ [ 0, "css-variables-no-encapsulation" ] ] ], [ "p-e3c45422.system", [ [ 1, "css-variables-shadow-dom", {
          isGreen: [ 32 ]
        } ] ] ], [ "p-b29ef16e.system", [ [ 17, "custom-elements-delegates-focus" ] ] ], [ "p-427ef29a.system", [ [ 1, "custom-elements-no-delegates-focus" ] ] ], [ "p-e7423653.system", [ [ 0, "custom-event-root", {
          output: [ 32 ]
        } ] ] ], [ "p-276f7668.system", [ [ 17, "delegates-focus" ] ] ], [ "p-fae71c4b.system", [ [ 0, "dom-reattach", {
          willLoad: [ 1026, "will-load" ],
          didLoad: [ 1026, "did-load" ],
          didUnload: [ 1026, "did-unload" ]
        } ] ] ], [ "p-41984b4a.system", [ [ 4, "dom-reattach-clone" ] ] ], [ "p-97f9da67.system", [ [ 4, "dom-reattach-clone-deep-slot" ] ] ], [ "p-0fcf9aa5.system", [ [ 4, "dom-reattach-clone-host" ] ] ], [ "p-253d3fdb.system", [ [ 0, "dynamic-css-variable", {
          bgColor: [ 32 ]
        } ] ] ], [ "p-034404bb.system", [ [ 0, "dynamic-import", {
          value: [ 32 ],
          update: [ 64 ]
        } ] ] ], [ "p-1a778a2d.system", [ [ 1, "es5-addclass-svg" ] ] ], [ "p-93cb92cb.system", [ [ 1, "esm-import", {
          propVal: [ 2, "prop-val" ],
          isReady: [ 32 ],
          stateVal: [ 32 ],
          listenVal: [ 32 ],
          someEventInc: [ 32 ],
          someMethod: [ 64 ]
        }, [ [ 0, "click", "testClick" ] ] ] ] ], [ "p-33e500f1.system", [ [ 0, "event-basic", {
          counter: [ 32 ]
        }, [ [ 0, "testEvent", "testEventHandler" ] ] ] ] ], [ "p-26bf717c.system", [ [ 0, "event-custom-type", {
          counter: [ 32 ],
          lastEventValue: [ 32 ]
        }, [ [ 0, "testEvent", "testEventHandler" ] ] ] ] ], [ "p-e75021c8.system", [ [ 0, "external-import-a" ] ] ], [ "p-50fb66a1.system", [ [ 0, "external-import-b" ] ] ], [ "p-70132be3.system", [ [ 0, "external-import-c" ] ] ], [ "p-5ec6b7c7.system", [ [ 0, "factory-jsx" ] ] ], [ "p-e890fc85.system", [ [ 0, "image-import" ] ] ], [ "p-dd825483.system", [ [ 0, "init-css-root" ] ] ], [ "p-2ed4f84b.system", [ [ 0, "input-basic-root", {
          value: [ 1025 ]
        } ] ] ], [ "p-d424fd5d.system", [ [ 0, "json-basic" ] ] ], [ "p-854213ee.system", [ [ 0, "key-reorder", {
          num: [ 2 ]
        } ] ] ], [ "p-0881c90c.system", [ [ 0, "key-reorder-root", {
          isReversed: [ 32 ]
        } ] ] ], [ "p-3c638bcf.system", [ [ 1, "lifecycle-nested-a" ] ] ], [ "p-709a1034.system", [ [ 1, "lifecycle-nested-b" ] ] ], [ "p-a60a273c.system", [ [ 1, "lifecycle-nested-c" ] ] ], [ "p-bcd2ae16.system", [ [ 2, "listen-reattach", {
          clicked: [ 32 ]
        }, [ [ 0, "click", "click" ] ] ] ] ], [ "p-233d44fa.system", [ [ 0, "listen-window", {
          clicked: [ 32 ],
          scrolled: [ 32 ]
        }, [ [ 8, "click", "winClick" ], [ 9, "scroll", "winScroll" ] ] ] ] ], [ "p-6840d96a.system", [ [ 1, "no-delegates-focus" ] ] ], [ "p-23ec5e9b.system", [ [ 0, "node-globals" ] ] ], [ "p-f61d03e8.system", [ [ 0, "node-resolution" ] ] ], [ "p-44374aec.system", [ [ 1, "reflect-nan-attribute", {
          val: [ 514 ]
        } ] ] ], [ "p-9c2809bb.system", [ [ 1, "reflect-nan-attribute-hyphen", {
          valNum: [ 514, "val-num" ]
        } ] ] ], [ "p-f6699495.system", [ [ 0, "reflect-to-attr", {
          str: [ 513 ],
          nu: [ 514 ],
          undef: [ 513 ],
          null: [ 513 ],
          bool: [ 516 ],
          otherBool: [ 516, "other-bool" ],
          disabled: [ 516 ],
          dynamicStr: [ 1537, "dynamic-str" ],
          dynamicNu: [ 514, "dynamic-nu" ]
        } ] ] ], [ "p-e2a24f2b.system", [ [ 1, "reparent-style-no-vars" ] ] ], [ "p-cf7b09ae.system", [ [ 1, "reparent-style-with-vars" ] ] ], [ "p-f2245a2d.system", [ [ 1, "sass-cmp" ] ] ], [ "p-add7ab9e.system", [ [ 1, "shadow-dom-slot-basic" ] ] ], [ "p-5ebf2907.system", [ [ 4, "slot-array-basic" ] ] ], [ "p-34029a68.system", [ [ 1, "slot-array-top" ] ] ], [ "p-60abeee8.system", [ [ 1, "slot-children-root" ] ] ], [ "p-6fef24c7.system", [ [ 4, "slot-html", {
          inc: [ 2 ]
        } ] ] ], [ "p-073b9d7a.system", [ [ 4, "slot-ng-if" ] ] ], [ "p-3ef30a19.system", [ [ 4, "slot-no-default" ] ] ], [ "p-88747b3f.system", [ [ 1, "slotted-css" ] ] ], [ "p-4e33aaea.system", [ [ 0, "static-styles" ] ] ], [ "p-58e5e513.system", [ [ 0, "svg-attr", {
          isOpen: [ 32 ]
        } ] ] ], [ "p-ee86d079.system", [ [ 0, "svg-class", {
          hasColor: [ 32 ]
        } ] ] ], [ "p-d62877c6.system", [ [ 0, "tag-3d-component" ] ] ], [ "p-cdccb23a.system", [ [ 0, "tag-88" ] ] ], [ "p-4d8548f5.system", [ [ 1, "custom-element-child" ] ] ], [ "p-df85ca14.system", [ [ 0, "lifecycle-async-b", {
          value: [ 1 ]
        } ] ] ], [ "p-cbfce61f.system", [ [ 0, "lifecycle-basic-b", {
          value: [ 1 ],
          rendered: [ 32 ]
        } ] ] ], [ "p-7fe8e21d.system", [ [ 1, "lifecycle-unload-a" ] ] ], [ "p-a77c6388.system", [ [ 0, "lifecycle-update-b", {
          value: [ 2 ]
        } ] ] ], [ "p-980de4fa.system", [ [ 2, "slot-dynamic-scoped-list", {
          items: [ 16 ]
        } ] ] ], [ "p-486d3eca.system", [ [ 1, "slot-dynamic-shadow-list", {
          items: [ 16 ]
        } ] ] ], [ "p-4308f4c3.system", [ [ 0, "attribute-basic", {
          single: [ 1 ],
          multiWord: [ 1, "multi-word" ],
          customAttr: [ 1, "my-custom-attr" ],
          getter: [ 6145 ]
        } ] ] ], [ "p-01a83f44.system", [ [ 1, "child-reflect-nan-attribute", {
          val: [ 514 ]
        } ] ] ], [ "p-6d2e67b9.system", [ [ 1, "child-with-reflection", {
          val: [ 520 ]
        } ] ] ], [ "p-0a18debd.system", [ [ 4, "conditional-rerender" ] ] ], [ "p-781d567a.system", [ [ 1, "custom-element-child-different-name-than-class" ] ] ], [ "p-adeb735c.system", [ [ 2, "listen-jsx", {
          wasClicked: [ 32 ]
        }, [ [ 0, "click", "onClick" ] ] ] ] ], [ "p-deda6a2a.system", [ [ 6, "scoped-basic" ] ] ], [ "p-13d869db.system", [ [ 1, "shadow-dom-array", {
          values: [ 16 ]
        } ] ] ], [ "p-adeefc42.system", [ [ 1, "shadow-dom-basic" ] ] ], [ "p-2a742b84.system", [ [ 33, "shadow-dom-mode" ] ] ], [ "p-805df9c0.system", [ [ 1, "shadow-dom-slot-nested", {
          i: [ 2 ]
        } ] ] ], [ "p-0bf205d0.system", [ [ 6, "sibling-root" ] ] ], [ "p-dd431c19.system", [ [ 4, "slot-array-complex" ] ] ], [ "p-f45e7e78.system", [ [ 4, "slot-basic" ] ] ], [ "p-ee549108.system", [ [ 4, "slot-basic-order" ] ] ], [ "p-68805cfb.system", [ [ 4, "slot-dynamic-wrapper", {
          tag: [ 1 ]
        } ] ] ], [ "p-4232f519.system", [ [ 4, "slot-fallback", {
          inc: [ 2 ]
        } ] ] ], [ "p-46b40f5b.system", [ [ 4, "slot-light-dom-content" ] ] ], [ "p-673e6273.system", [ [ 4, "slot-map-order" ] ] ], [ "p-188592bc.system", [ [ 4, "slot-nested-order-child" ] ] ], [ "p-432a7943.system", [ [ 4, "slot-reorder", {
          reordered: [ 4 ]
        } ] ] ], [ "p-ea42eea7.system", [ [ 4, "slot-replace-wrapper", {
          href: [ 1 ]
        } ] ] ], [ "p-f0a393a7.system", [ [ 1, "custom-element-nested-child" ] ] ], [ "p-98a92c6f.system", [ [ 0, "lifecycle-async-c", {
          value: [ 1 ]
        } ] ] ], [ "p-1a24aa15.system", [ [ 0, "lifecycle-basic-c", {
          value: [ 1 ],
          rendered: [ 32 ]
        } ] ] ], [ "p-c99408e4.system", [ [ 1, "lifecycle-unload-b" ] ] ], [ "p-bf440372.system", [ [ 0, "lifecycle-update-c", {
          value: [ 2 ]
        } ] ] ], [ "p-cf412bec.system", [ [ 4, "slot-light-list" ] ] ], [ "p-0c61ea16.system", [ [ 4, "slot-light-scoped-list" ] ] ] ], e);
      }));
    }
  };
}));