import { Component, Event, EventEmitter, Host, h, Prop } from '@stencil/core';
import { InputFile } from '../stencil-repl/stencil-repl';

@Component({
  tag: 'repl-input-selection',
  styleUrl: 'repl-input-selection.css',
  shadow: true
})
export class ReplInputSelection {

  @Prop() name: string;
  @Prop() isSelected = false;
  @Event() fileSelect: EventEmitter<InputFile>;
  @Event() fileDelete: EventEmitter<InputFile>;

  render() {
    return (
      <Host
        class={{ selected: this.isSelected}}
      >
        <button class="name" onClick={() => this.fileSelect.emit({
          name: this.name
        })}>
          {this.name}
        </button>
        <button onClick={() => this.fileDelete.emit({
          name: this.name
        })} class="close">
          X
        </button>
      </Host>
    );
  }

}
