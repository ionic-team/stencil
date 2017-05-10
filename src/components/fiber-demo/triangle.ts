import { Component, Prop, h } from '../index';

var targetSize = 25;

@Component({
  tag: 'fiber-triangle',
  shadow: false
})
export class FiberTriangle {
  $el: HTMLElement;

  @Prop() x: number;
  @Prop() y: number;
  @Prop() s: number;
  @Prop() seconds: number;

  render() {
    var s = this.s;
    if (s <= targetSize) {
      return h(this,
        h('fiber-dot', {
            attrs: {
              x: this.x - (targetSize / 2),
              y: this.y - (targetSize / 2),
              size: targetSize,
              text: this.seconds.toString()
            }
          }
        )
      );
    }
    s = s / 2;
    return h(this, {
        style: {
          visibility: 'visible'
        }
      },
      [
        h('fiber-triangle', {
            attrs: {
              x: this.x,
              y: this.y - (s / 2),
              s: s,
              seconds: this.seconds
            }
          }
        ),
        h('fiber-triangle', {
            attrs: {
              x: this.x - s,
              y: this.y + (s / 2),
              s: s,
              seconds: this.seconds
            }
          }
        ),
        h('fiber-triangle', {
            attrs: {
              x: this.x + s,
              y: this.y + (s / 2),
              s: s,
              seconds: this.seconds
            }
          }
        )
      ]
    );
  }
}
