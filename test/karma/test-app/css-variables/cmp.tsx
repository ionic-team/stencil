import { Component, State } from '../../../../dist/index';

@Component({
  tag: 'css-variables'
})
export class CssVariables {

  @State() theme: string = 'default';

  hostData() {
    return {
      'class': {
        [this.theme]: true
      }
    };
  }

  render() {
    return [
      <header>
        CSS Variables!!
      </header>,
      <main>
        <p><button onClick={() => this.theme = 'light'}>Light Theme</button></p>
        <p><button onClick={() => this.theme = 'dark'}>Dark Theme</button></p>
        <p><button onClick={() => this.theme = 'default'}>Default Theme</button></p>
      </main>
    ];
  }

}
