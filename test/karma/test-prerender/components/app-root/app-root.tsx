import { Component } from '../../../../../dist/index';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  render() {
    return (
      <main>
        <header>App Root</header>
        <cmp-a/>
        <div class="server">
          <div id="server-componentWillLoad"/>
          <div id="server-componentDidLoad"/>
        </div>
        <div class="client">
          <div id="client-componentWillLoad"/>
          <div id="client-componentDidLoad"/>
        </div>
      </main>
    );
  }
}
