import { Component, Element } from '../../../../dist/index';

@Component({
  tag: 'lifecycle-unload-b',
  shadow: true
})
export class LifecycleUnloadB {

  @Element() elm: HTMLElement;
  results: HTMLDivElement;

  componentDidLoad() {
    this.results = this.elm.ownerDocument.body.querySelector('#lifecycle-unload-results');
  }

  componentDidUnload() {
    const elm = document.createElement('div');
    elm.textContent = 'cmp-b unload';
    this.results.appendChild(elm);
  }

  render() {
    return [
      <article>cmp-b - top</article>,
      <section><slot/></section>,
      <nav>cmp-b - bottom</nav>
    ];
  }
}
