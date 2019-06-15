import { Component, Host, h, Prop } from '@stencil/core';


@Component({
  tag: 'src-file',
  styles: `
    :host {
      display: block;
    }
    textarea {
      display: block;
      width: 95%;
      height: 200px;
    }
  `,
  shadow: true
})
export class SrcFile {

  @Prop() file: { filePath: string, content: string };

  render() {
    return (
      <Host>
        <div>{this.file.filePath}</div>
        <textarea>{this.file.content}</textarea>
      </Host>
    )
  }

}
