import { r as c, h as e, H as o } from "./p-62388dca.js";

const l = class {
  constructor(e) {
    c(this, e);
  }
  render() {
    return e(o, null, e("cmp-a", null, e("cmp-d", {
      uniqueId: "a1-child"
    }), e("cmp-d", {
      uniqueId: "a2-child"
    }), e("cmp-d", {
      uniqueId: "a3-child"
    }), e("cmp-d", {
      uniqueId: "a4-child"
    })), e("div", {
      class: "server"
    }, e("div", {
      id: "server-componentWillLoad"
    }), e("div", {
      id: "server-componentDidLoad"
    })), e("div", {
      class: "client"
    }, e("div", {
      id: "client-componentWillLoad"
    }), e("div", {
      id: "client-componentDidLoad"
    })), e("div", null, e("cmp-scoped-a", null)), e("div", null, e("cmp-scoped-b", null)));
  }
};

function printLifecycle(c, e) {
  const o = document.createElement("div");
  {
    const l = document.getElementById(`client-${e}`);
    o.textContent = `${c} client ${e}`, l.appendChild(o);
  }
}

l.style = "app-root{display:block;padding:10px;background:blue}.server{padding:10px;background:darkorange}.client{padding:10px;background:cyan}";

const n = class {
  constructor(e) {
    c(this, e);
  }
  componentWillLoad() {
    printLifecycle("CmpA", "componentWillLoad");
  }
  componentDidLoad() {
    printLifecycle("CmpA", "componentDidLoad");
  }
  render() {
    return e("div", null, e("div", null, "CmpA"), e("cmp-b", null), e("slot", null));
  }
};

n.style = "cmp-a{display:block;padding:10px;background:red}";

const s = class {
  constructor(e) {
    c(this, e);
  }
  componentWillLoad() {
    printLifecycle("CmpB", "componentWillLoad");
  }
  componentDidLoad() {
    printLifecycle("CmpB", "componentDidLoad");
  }
  render() {
    return e("div", null, e("div", null, "CmpB"), e("cmp-c", null));
  }
};

s.style = "cmp-b{display:block;padding:10px;background:yellow}";

const d = class {
  constructor(e) {
    c(this, e);
  }
  componentWillLoad() {
    printLifecycle("CmpC", "componentWillLoad");
  }
  componentDidLoad() {
    printLifecycle("CmpC", "componentDidLoad");
  }
  render() {
    return e("div", null, e("div", null, "CmpC"), e("cmp-d", {
      uniqueId: "c-child"
    }));
  }
};

d.style = "cmp-c{display:block;padding:10px;background:fuchsia}";

const t = class {
  constructor(e) {
    c(this, e);
  }
  render() {
    return e("section", {
      class: "client-scoped"
    }, e("slot", null));
  }
};

t.style = ".sc-cmp-client-scoped-h{display:block;border:10px solid yellow;margin:10px;padding:10px}.client-scoped.sc-cmp-client-scoped{color:rgb(255, 0, 0);font-weight:bold}";

const p = class {
  constructor(e) {
    c(this, e);
  }
  render() {
    return e("article", {
      class: "client-shadow"
    }, e("slot", null), e("cmp-text-blue", null), e("cmp-text-green", null));
  }
};

p.style = ":host{display:block;border:10px solid purple;margin:10px;padding:10px}.client-shadow{color:rgb(0, 155, 0);font-weight:bold}";

const r = class {
  constructor(e) {
    c(this, e), this.uniqueId = "";
  }
  componentWillLoad() {
    printLifecycle(`CmpD - ${this.uniqueId}`, "componentWillLoad");
  }
  componentDidLoad() {
    printLifecycle(`CmpD - ${this.uniqueId}`, "componentDidLoad");
  }
  render() {
    return e("div", null, "CmpD");
  }
};

r.style = "cmp-d{display:block;padding:10px;background:lime}";

const i = class {
  constructor(e) {
    c(this, e);
  }
  render() {
    return e("div", null, e("p", null, "cmp-scoped-a"), e("p", {
      class: "scoped-class"
    }, "scoped-class"));
  }
};

i.style = ".sc-cmp-scoped-a-h{display:block;background-color:rgb(0, 128, 0)}div.sc-cmp-scoped-a{font-size:14px}p.sc-cmp-scoped-a{color:rgb(128, 0, 128)}.scoped-class.sc-cmp-scoped-a{color:rgb(0, 0, 255)}.i-am-an-unused-selecor.sc-cmp-scoped-a{color:rgb(255, 0, 0)}";

const a = class {
  constructor(e) {
    c(this, e);
  }
  render() {
    return e("div", null, e("p", null, "cmp-scoped-b"), e("p", {
      class: "scoped-class"
    }, "scoped-class"));
  }
};

a.style = ".sc-cmp-scoped-b-h{display:block;background-color:rgb(128, 128, 128)}div.sc-cmp-scoped-b{font-size:18px}p.sc-cmp-scoped-b{color:rgb(0, 128, 0)}.scoped-class.sc-cmp-scoped-b{color:rgb(255, 255, 0)}.i-am-an-unused-selecor.sc-cmp-scoped-b{color:rgb(255, 0, 0)}";

const u = class {
  constructor(e) {
    c(this, e);
  }
  render() {
    return e("text-blue", null, "blue text, green border");
  }
};

u.style = ".sc-cmp-text-blue-h{display:block;border:10px solid rgb(0, 255, 0);margin:10px;padding:10px;background-color:white}text-blue.sc-cmp-text-blue{display:block;color:rgb(0, 0, 255);font-weight:bold}";

const m = class {
  constructor(e) {
    c(this, e);
  }
  render() {
    return e("text-green", null, "green text, blue border");
  }
};

m.style = ".sc-cmp-text-green-h{display:block;border:10px solid rgb(0, 0, 255);margin:10px;padding:10px;background-color:white}text-green.sc-cmp-text-green{display:block;color:rgb(0, 255, 0);font-weight:bold}";

export { l as app_root, n as cmp_a, s as cmp_b, d as cmp_c, t as cmp_client_scoped, p as cmp_client_shadow, r as cmp_d, i as cmp_scoped_a, a as cmp_scoped_b, u as cmp_text_blue, m as cmp_text_green }