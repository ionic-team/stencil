import { Component, Event, EventEmitter, Host, h, Prop, State } from '@stencil/core';
import { OutputFile } from '../../compiler/declarations';

@Component({
  tag: 'repl-output-panel',
  styleUrl: 'repl-output-panel.css',
  shadow: true
})
export class ReplOutputPanel {

  @Prop() outputs: OutputFile[] = [];
  @Prop() selectedTarget: string;
  @State() selectedOutputName: string;
  @Event() targetUpdate: EventEmitter<string>;
  outputTargets = [
    'dist-collection',
    'dist-custom-elements',
    'dist-custom-elements-bundle',
    'dist-lazy',
    'www',
  ];

  componentWillRender() {
    if (this.outputs.length > 0 && !this.outputs.some(o => o.name === this.selectedOutputName)) {
      this.selectedOutputName = this.outputs[0].name;
    }
  }

  targetChange = (ev: UIEvent) => {
    this.targetUpdate.emit((ev.target as any).value);
  };

  render() {
    const outputs = this.outputs;
    return (
      <Host>

        <section>
          <select
            onInput={this.targetChange}>
            {(this.outputTargets.map(outputTarget => (
              <option
                value={outputTarget}
                selected={this.selectedTarget === outputTarget}
              >
                {outputTarget}
              </option>
            )))}
          </select>

          <select
            onInput={ev => this.selectedOutputName = (ev.target as any).value}
            hidden={outputs.length === 0}
          >
            {(outputs.map(output => (
              <option
                value={output.name}
                selected={output.name === this.selectedOutputName}
              >
                {output.name}
              </option>
            )))}
          </select>
        </section>

        <section>
          {(outputs.map(output => (
            <repl-output-file
              code={output.code}
              name={output.name}
              isSelected={output.name === this.selectedOutputName}
            />
          )))}
        </section>

      </Host>
    );
  }
}
