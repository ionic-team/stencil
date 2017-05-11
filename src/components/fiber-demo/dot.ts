import { Component, Prop, h } from '../index';

@Component({
  tag: 'fiber-dot',
  shadow: false
})
export class FiberDot {
  $el: HTMLElement;

  @Prop() size: number;
  @Prop() x: number;
  @Prop() y: number;
  @Prop() text: string;

  hover: boolean = false;

  enter() {
    this.hover = true;
  }

  leave() {
    this.hover = false;
  }

  render() {
    var s = this.size * 1.3;
    var style = {
      position: 'absolute',
      font: 'normal 15px sans-serif',
      textAlign: 'center',
      cursor: 'pointer',
      width: s + 'px',
      height: s + 'px',
      left: (this.x) + 'px',
      top: (this.y) + 'px',
      borderRadius: (s / 2) + 'px',
      lineHeight: (s) + 'px',
      background: this.hover ? '#ff0' : '#61dafb'
    };

    return h(this, {
        style: style,
        on: {
          mouseenter: this.enter.bind(this),
          mouseleave: this.leave.bind(this)
        },
      },
      this.hover ? '*' + this.text + '*' : this.text
    );
  }
}
