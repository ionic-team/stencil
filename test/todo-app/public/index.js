const t = window,
  e = document,
  l = new WeakMap,
  n = t => l.get(t),
  s = t => {
    const e = {
      t: 0,
      l: t,
      s: new Map
    };
    return l.set(t, e)
  },
  o = (t, e) => e in t,
  c = {},
  u = t => "object" == (t = typeof t) || "function" === t,
  i = (t, e, ...l) => {
    let n = null,
      s = !1,
      o = !1,
      c = [];
    const i = e => {
      for (let l = 0; l < e.length; l++) n = e[l], Array.isArray(n) ? i(n) : null != n && "boolean" != typeof n && ((s = "function" != typeof t && !u(n)) && (n = String(n)), s && o ? c[c.length - 1].o += n : c.push(s ? r(null, n) : n), o = s)
    };
    if (i(l), e) {
      const t = e.className || e.class;
      t && (e.class = "object" != typeof t ? t : Object.keys(t).filter(e => t[e]).join(" "))
    }
    const a = r(t, null);
    return a.u = e, c.length > 0 && (a.i = c), a
  },
  r = (t, e) => ({
    t: 0,
    h: t,
    o: e,
    m: null,
    i: null,
    u: null
  }),
  a = {},
  h = (e, l, n, s, c, i) => {
    if (n === s) return;
    let r = o(e, l),
      a = l.toLowerCase();
    if ("class" === l) {
      const t = e.classList,
        l = m(n),
        o = m(s);
      t.remove(...l.filter(t => t && !o.includes(t))), t.add(...o.filter(t => t && !l.includes(t)))
    } else if (r || "o" !== l[0] || "n" !== l[1]) {
      const t = u(s);
      if ((r || t && null !== s) && !c) try {
        if (e.tagName.includes("-")) e[l] = s;
        else {
          let t = null == s ? "" : s;
          null != n && e[l] == t || (e[l] = t)
        }
      } catch (h) {}
      null == s || !1 === s ? e.removeAttribute(l) : (!r || 4 & i || c) && !t && e.setAttribute(l, s = !0 === s ? "" : s)
    } else l = "-" === l[2] ? l.slice(3) : o(t, a) ? a.slice(2) : a[2] + l.slice(3), n && ((t, e, l) => t.removeEventListener(e, l, !1))(e, l, n), s && ((t, e, l) => t.addEventListener(e, l, !1))(e, l, s)
  },
  d = /\s/,
  m = t => t ? t.split(d) : [],
  p = (t, e, l, n) => {
    const s = 11 === e.m.nodeType && e.m.host ? e.m.host : e.m,
      o = t && t.u || c,
      u = e.u || c;
    for (n in o) n in u || h(s, n, o[n], void 0, l, e.t);
    for (n in u) h(s, n, o[n], u[n], l, e.t)
  },
  f = (t, l, n) => {
    let s, o, c = l.i[n],
      u = 0;
    if (null !== c.o) c.m = e.createTextNode(c.o);
    else if (s = c.m = e.createElement(c.h), p(null, c, !1), c.i)
      for (u = 0; u < c.i.length; ++u)(o = f(t, c, u)) && s.appendChild(o);
    return c.m
  },
  $ = (t, e, l, n, s, o) => {
    let c, u = t;
    for (; s <= o; ++s) n[s] && (c = f(null, l, s)) && (n[s].m = c, u.insertBefore(c, e))
  },
  b = (t, e, l) => {
    for (; e <= l; ++e) t[e] && t[e].m.remove()
  },
  g = (t, e) => t.h === e.h,
  k = (t, e) => {
    const l = e.m = t.m,
      n = t.i,
      s = e.i;
    null === e.o ? (p(t, e, !1), null !== n && null !== s ? ((t, e, l, n) => {
      let s, o = 0,
        c = 0,
        u = e.length - 1,
        i = e[0],
        r = e[u],
        a = n.length - 1,
        h = n[0],
        d = n[a];
      for (; o <= u && c <= a;) null == i ? i = e[++o] : null == r ? r = e[--u] : null == h ? h = n[++c] : null == d ? d = n[--a] : g(i, h) ? (k(i, h), i = e[++o], h = n[++c]) : g(r, d) ? (k(r, d), r = e[--u], d = n[--a]) : g(i, d) ? (k(i, d), t.insertBefore(i.m, r.m.nextSibling), i = e[++o], d = n[--a]) : g(r, h) ? (k(r, h), t.insertBefore(r.m, i.m), r = e[--u], h = n[++c]) : (s = f(e && e[c], l, c), h = n[++c], s && i.m.parentNode.insertBefore(s, i.m));
      o > u ? $(t, null == n[a + 1] ? null : n[a + 1].m, l, n, c, a) : c > a && b(e, o, u)
    })(l, n, e, s) : null !== s ? (null !== t.o && (l.textContent = ""), $(l, null, e, s, 0, s.length - 1)) : null !== n && b(n, 0, n.length - 1)) : t.o !== e.o && (l.data = e.o)
  },
  x = (t, e, l) => {
    const n = t;
    return C(void 0, () => y(t, e, l, n))
  },
  y = (t, e, l, n) => {
    try {
      ((t, e, l, n) => {
        const s = e.p || r(null, null),
          o = (t => t && t.h === a)(n) ? n : i(null, null, n);
        o.h = null, o.t |= 4, e.p = o, o.m = s.m = t, k(s, o)
      })(t, e, 0, n.render())
    } catch (s) {
      (t => console.error(t))(s)
    }
    e.t |= 2, v(t, e)
  },
  v = (t, e) => {
    64 & e.t || (e.t |= 64)
  },
  C = (t, e) => t && t.then ? t.then(e) : e(),
  j = (t, e) => {
    if (e.$) {
      const l = Object.entries(e.$),
        s = t.prototype;
      l.forEach(([t, [l]]) => {
        (31 & l || 32 & l) && Object.defineProperty(s, t, {
          get() {
            return ((t, e) => n(t).s.get(e))(this, t)
          },
          set(l) {
            ((t, e, l, s) => {
              const o = n(t),
                c = t,
                i = o.s.get(e),
                r = o.t;
              (l = ((t, e) => null == t || u(t) ? t : 4 & e ? "false" !== t && ("" === t || !!t) : 1 & e ? String(t) : t)(l, s.$[e][0])) === i || (o.s.set(e, l), 2 == (18 & r) && x(c, o, s))
            })(this, t, l, e)
          },
          configurable: !0,
          enumerable: !0
        })
      })
    }
    return t
  },
  w = (t, e) => {
    const l = {
      t: e[0],
      g: e[1],
      $: e[2],
      k: e[3],
      v: t.v
    };
    return Object.assign(t.prototype, {
      forceUpdate() {
        ((t, e) => {
          {
            const l = n(t);
            2 == (18 & l.t) && x(t, l, e)
          }
        })(this, l)
      },
      connectedCallback() {
        ((t, e) => {
          {
            const l = n(t);
            1 & l.t || (l.t |= 1, (async (t, e, l) => {
              (() => x(t, e, l))()
            })(t, l, e))
          }
        })(this, l)
      },
    }), j(t, l)
  },
  I = (t, e, l) => {
    const n = S(t);
    return {
      emit: t => n.dispatchEvent(new CustomEvent(e, {
        bubbles: !!(4 & l),
        composed: !!(2 & l),
        cancelable: !!(1 & l),
        detail: t
      }))
    }
  },
  S = t => t,
  T = class extends HTMLElement {
    constructor() {
      super(), s(this), this.inputSubmit = I(this, "inputSubmit", 7)
    }
    render() {
      const t = this.value;
      return i("form", {
        onSubmit: e => {
          t && (e.preventDefault(), this.inputSubmit.emit(t), this.value = "")
        }
      }, i("input", {
        class: "new-todo",
        value: t,
        type: "text",
        placeholder: "What needs to be done?",
        onInput: t => this.value = t.target.value
      }))
    }
  },
  E = class extends HTMLElement {
    constructor() {
      super(), s(this), this.itemCheck = I(this, "itemCheck", 7), this.itemRemove = I(this, "itemRemove", 7)
    }
    render() {
      const {
        checked: t,
        text: e,
        itemCheck: l,
        itemRemove: n
      } = this;
      return i("li", {
        class: {
          completed: t
        }
      }, i("input", {
        class: "toggle",
        type: "checkbox",
        checked: t,
        onChange: () => l.emit()
      }), i("label", null, e), i("button", {
        class: "destroy",
        onClick: () => n.emit()
      }))
    }
  },
  M = w(class extends HTMLElement {
    constructor() {
      super(), s(this), this.list = []
    }
    render() {
      const t = this.list,
        e = t.every(t => t.checked);
      return i("div", null, i("header", {
        class: "header"
      }, i("h1", null, "Todos Stencil"), i("todo-input", {
        onInputSubmit: e => {
          this.list = [...t, {
            text: e.detail
          }]
        }
      })), i("section", {
        class: "main",
        hidden: !t.length
      }, i("input", {
        id: "toggle-all",
        onInput: e => {
          this.list = t.map(t => (t.checked = !!e.target.checked, t))
        },
        class: "toggle-all",
        type: "checkbox",
        checked: e
      }), i("label", {
        htmlFor: "toggle-all"
      }), i("ul", {
        class: "todo-list"
      }, t.map((e, l) => i("todo-item", {
        onItemCheck: () => {
          t[l] = Object.assign({}, e, {
            checked: !e.checked
          }), this.list = t.slice()
        },
        onItemRemove: () => {
          this.list = [...t.slice(0, l), ...t.slice(l + 1)]
        },
        checked: e.checked,
        text: e.text
      })))))
    }
  }, [0, "app-root", {
    list: [32]
  }]),
  O = w(T, [0, "todo-input", {
    value: [32]
  }]),
  R = w(E, [0, "todo-item", {
    checked: [4],
    text: [1]
  }]);
export {
  M as AppRoot, O as TodoInput, R as TodoItem
};
