import { Component, Listen, State } from '../../../../dist';


@Component({
  tag: 'listen-window'
})
export class ListenWindow {
  @State() clicked = 0;
  @State() scrolled = 0;

  @Listen('window:click')
  winClick() {
    this.clicked++;
  }

  @Listen('window:scroll')
  winScroll() {
    this.scrolled++;
  }

  render() {
    return (
      <div>
        <div id="clicked">Clicked: {this.clicked}</div>
        <div>Scrolled: {this.scrolled}</div>
        <button>Click!</button>
        <div style={{background: 'gray', paddingTop: '2000px'}}></div>
      </div>
    );
  }
}
