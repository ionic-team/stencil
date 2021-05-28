import { Prop, Component, h, Host } from '@stencil/core';

const css = {'background-color': 'rgba(0, 0, 255, 0.1)'};

@Component({
  tag: 'mixed-in-cmp'
})
export class ToMixin {
  @Prop() middleName: string = 'B';
  private firstName: string;
  private surname: string;

  render() {
    return (
      <Host>
        <div style={css}>
          {this.firstName} {this.middleName} {this.surname}
        </div>
      </Host>
    )
  }
}
