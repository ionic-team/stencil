import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { InputFile } from '../stencil-repl/stencil-repl';


@Component({
  tag: 'repl-input-file',
  styleUrl: 'repl-input-file.css',
  shadow: true
})
export class ReplInputFile {

  @Prop() name: string;
  @Prop() code: string
  @Prop() isSelected = false;
  @Event() fileUpdate: EventEmitter<InputFile>;

  render() {
    return (
      <Host
        class={{
          selected: this.isSelected
        }}
      >
        <textarea
          onInput={(ev) => this.fileUpdate.emit({
            name: this.name,
            code: (ev.target as HTMLTextAreaElement).value
          })}
        >
          {this.code}
        </textarea>
      </Host>
    );
  }
}
