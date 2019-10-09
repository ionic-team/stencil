import { Component, Host, h, Prop } from '@stencil/core';


@Component({
  tag: 'repl-output-file',
  styleUrl: 'repl-output-file.css',
  shadow: true
})
export class ReplOutputFile {

  @Prop() name: string;
  @Prop() code: string
  @Prop() isSelected = false;

  render() {
    return (
      <Host
        class={{
          selected: this.isSelected
        }}
      >
        <textarea>
          {this.code}
        </textarea>
      </Host>
    );
  }
}
