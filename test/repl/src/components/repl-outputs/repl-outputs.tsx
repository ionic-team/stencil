import { Component, Event, EventEmitter, Host, h, Prop, State } from '@stencil/core';
import { OutputFile } from '../stencil-repl/stencil-repl';

@Component({
  tag: 'repl-outputs',
  styleUrl: 'repl-outputs.css',
  shadow: true
})
export class ReplOutputs {

  @Prop() outputs: OutputFile[] = [];
  @Prop() selectedTarget: string;
  @State() selectedOutputName: string;
  @Event() targetUpdate: EventEmitter<string>;
  outputTargets = ['dist-collection', 'dist-custom-elements', 'dist-lazy', 'www'];

  componentWillRender() {
    if (this.outputs.length > 0 && !this.outputs.some(o => o.name === this.selectedOutputName)) {
      this.selectedOutputName = this.outputs[0].name;
    }
  }

  render() {
    const outputs = this.outputs;
    return (
      <Host>

        <div>
          <select
            onInput={ev => this.targetUpdate.emit((ev.target as any).value)}>
            {(this.outputTargets.map(outputTarget => (
              <option
                value={outputTarget}
                selected={this.selectedTarget === outputTarget}
              >
                {outputTarget}
              </option>
            )))}
          </select>
        </div>

        <div>
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
        </div>

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
