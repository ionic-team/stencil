export class ShadowDomSlotBasic {
  static get is() { return "shadow-dom-slot-basic"; }
  static get encapsulation() { return "shadow"; }
  static get styles() { return ":host {\n      color: red;\n    }"; }
}
