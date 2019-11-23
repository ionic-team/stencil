import { Component, Host, h, Prop, State, Listen } from '@stencil/core';
import { createCompiler, initCompilerFs, loadConfig } from '../../compiler/load-compiler';
import { InputFile, OutputFile } from '../../compiler/declarations';
import * as d from '@stencil/core/internal';


@Component({
  tag: 'stencil-repl',
  styleUrl: 'stencil-repl.css',
  shadow: true
})
export class StencilRepl {

  @Prop() appName: string = 'Stencil Components';
  @Prop() stencilCompilerPath = `http://cdn.jsdelivr.net/npm/@stencil/core/compiler/stencil-browser.js`;
  @Prop() selectedTarget = 'dist-custom-elements';
  @Prop() inputs: InputFile[] = [];
  @State() outputs: OutputFile[] = [];

  compiler: d.WorkerCompiler;

  async loadCompiler() {
    if (this.compiler) {
      await this.compiler.destroy();
    }

    this.compiler = await createCompiler(this.stencilCompilerPath);

    await initCompilerFs(this.compiler, this.inputs);

    await loadConfig(this.compiler, this.selectedTarget);

    const watcher = await this.compiler.createWatcher();

    watcher.on('buildFinish', async buildResults => {
      const outputs = [];
      await Promise.all(buildResults.outputs.map(async output => {
        await Promise.all(output.files.map(async fileName => {
          outputs.push({
            name: fileName,
            code: await this.compiler.sys.readFile(fileName)
          });
        }));
      }));
      this.outputs = outputs;
    });

    watcher.start();
  }

  @Listen('fileAdd')
  async fileAdd(ev: any) {
    const filePath = (ev.detail as InputFile).name;
    console.log('fileAdd:', filePath);
    const code = (ev.detail as InputFile).code;
    await this.compiler.sys.writeFile(filePath, code);
    this.inputs = [
      ...this.inputs,
      { name: filePath, code }
    ];
  }

  @Listen('fileUpdate')
  async fileUpdate(ev: any) {
    const filePath = (ev.detail as InputFile).name;
    console.log('fileUpdate:',filePath);
    const code = (ev.detail as InputFile).code;
    await this.compiler.sys.writeFile(filePath, code);
    const input = this.inputs.find(i => i.name === filePath);
    input.code = code;
    this.inputs = this.inputs.slice();
  }

  @Listen('fileDelete')
  async fileDelete(ev: any) {
    const filePath = (ev.detail as InputFile).name;
    console.log('fileDelete:', filePath);
    await this.compiler.sys.unlink(filePath);
    this.inputs = this.inputs.filter(i => i.name !== filePath);
  }

  @Listen('targetUpdate')
  async targetUpdate(ev: any) {
    console.log('targetUpdate:', ev.detail);
    this.selectedTarget = ev.detail;
    this.loadCompiler();
  }

  async componentDidLoad() {
    this.loadCompiler();
  }

  render() {
    return (
      <Host>
        <repl-header appName={this.appName}></repl-header>
        <repl-viewport>
          <repl-inputs slot="left" inputs={this.inputs}/>
          <repl-outputs slot="right" outputs={this.outputs} selectedTarget={this.selectedTarget}/>
        </repl-viewport>
      </Host>
    );
  }
}
