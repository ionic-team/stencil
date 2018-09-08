import { Component } from '../../../../../dist';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  render() {
    return (
      <main>
        <header>App Root</header>
        <cmp-a>
          <cmp-d unique-id="a1-child"/>
          <cmp-d unique-id="a2-child"/>
          <cmp-d unique-id="a3-child"/>
          <cmp-d unique-id="a4-child"/>
        </cmp-a>
        <div class="server">
          <div id="server-componentWillLoad"/>
          <div id="server-componentDidLoad"/>
        </div>
        <div class="client">
          <div id="client-componentWillLoad"/>
          <div id="client-componentDidLoad"/>
        </div>
        <div>
          <cmp-scoped-a></cmp-scoped-a>
        </div>
        <div>
          <cmp-scoped-b></cmp-scoped-b>
        </div>
      </main>
    );
  }
}
