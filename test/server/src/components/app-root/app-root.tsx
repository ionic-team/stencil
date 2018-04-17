import { Component } from '../../../../../dist/index';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {
  render() {
    return [
      <main>
        <h1>Stencil SSR Example</h1>
        <p>Yes, Stencil can render on-demand in server requests too!</p>
        <p>Rendered: <current-date></current-date></p>
      </main>
    ];
  }
}