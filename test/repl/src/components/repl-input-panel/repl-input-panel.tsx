import { Component, Host, h, Prop, Listen } from '@stencil/core';
import { InputFile } from '../../compiler/declarations';

@Component({
  tag: 'repl-input-panel',
  styleUrl: 'repl-input-panel.css',
  shadow: true
})
export class ReplInputPanel {

  @Prop() inputs: InputFile[] = [];
  @Prop() selectedName: string;

  @Listen('fileSelect')
  onFileSelect(ev: UIEvent) {
    this.selectedName = (ev.detail as any).name;
  }

  componentWillRender() {
    if (this.inputs.length > 0 && !this.inputs.some(i => i.name === this.selectedName)) {
      this.selectedName = this.inputs[0].name;
    }
  }

  render() {
    return (
      <Host>
        <repl-input-selector inputs={this.inputs}/>
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
