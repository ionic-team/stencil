
export class Button {
  private el: HTMLElement
  private d: any = {};

  constructor(el: HTMLElement) {
    this.el = el;
  }

  connectedCallback() {

  }

  disconnectedCallback() {
    this.el = null;
  }

  set outline(val: any) {

  }

  get render() {
    return function() {

    }
  }

}
