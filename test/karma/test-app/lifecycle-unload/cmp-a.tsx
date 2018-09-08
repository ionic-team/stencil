import { Component, Element } from '../../../../dist';

@Component({
  tag: 'lifecycle-unload-a',
  shadow: true
})
export class LifecycleUnloadA {

  @Element() elm: HTMLElement;
  results: HTMLDivElement;

  componentDidLoad() {
    this.results = this.elm.ownerDocument.body.querySelector('#lifecycle-unload-results');
  }

  componentDidUnload() {
    const elm = document.createElement('div');
    elm.textContent = 'cmp-a unload';
    this.results.appendChild(elm);
  }

  render() {
    return (
      <main>
        <header>cmp-a - top</header>
        <lifecycle-unload-b>cmp-a - middle</lifecycle-unload-b>
        <footer>cmp-a - bottom</footer>
      </main>
    );
  }
}
