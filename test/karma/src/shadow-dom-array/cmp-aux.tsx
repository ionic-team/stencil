import { Component, Element } from '../../../../dist/index';

@Component({
  tag: 'shadow-dom-aux',
  styleUrl: 'aux.css',
  shadow: true
})
export class ShadowDomAux {

  @Element() el: HTMLElement;

  componentWillLoad() {
    this.el.shadowRoot.textContent = '#';
  }
}
