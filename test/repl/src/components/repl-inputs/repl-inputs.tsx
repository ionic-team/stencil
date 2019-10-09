import { Component, Host, h, Prop, Listen } from '@stencil/core';
import { InputFile } from '../stencil-repl/stencil-repl';

@Component({
  tag: 'repl-inputs',
  styleUrl: 'repl-inputs.css',
  shadow: true
})
export class ReplInputs {

  @Prop() inputs: InputFile[] = [];
  @Prop() selectedName: string;

  @Listen('fileSelect')
  onFileSelect(ev: UIEvent) {
    this.selectedName = (ev.detail as any).name;
  }

  render() {
    if (this.inputs.length > 0 && !this.inputs.some(i => i.name === this.selectedName)) {
      this.selectedName = this.inputs[0].name;
    }

    return (
      <Host>
        <header>
          {(this.inputs.map(input => (
            <repl-input-selection
              name={input.name}
              isSelected={input.name === this.selectedName}
            />
          )))}
          <button
            class="add-input"
          >+</button>
        </header>
        <section>
          {(this.inputs.map(input => (
            <repl-input-file
              code={input.code}
              name={input.name}
              isSelected={input.name === this.selectedName}
            />
          )))}
        </section>
      </Host>
    );
  }
}
