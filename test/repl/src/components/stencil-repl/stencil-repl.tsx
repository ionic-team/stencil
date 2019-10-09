import { Component, Host, h, Prop, State, Listen } from '@stencil/core';
import * as d from '@stencil/core/internal';


@Component({
  tag: 'stencil-repl',
  styleUrl: 'stencil-repl.css',
  shadow: true
})
export class StencilRepl {

  @Prop() appName: string = 'Stencil Components';
  @Prop() stencilCompilerPath = `http://cdn.jsdelivr.net/npm/@stencil/core/compiler/stencil-browser.js`;
  @Prop() selectedTarget = 'custom-element-next';
  @Prop() inputs: InputFile[] = [];
  @State() outputs: OutputFile[] = [];

  compiler: d.WorkerCompiler;

  async loadCompiler() {
    if (this.compiler) {
      await this.compiler.destroy();
    }

    const stencil = await import(this.stencilCompilerPath);

    this.compiler = await stencil.createWorkerCompiler();

    await this.compiler.sys.mkdir('/src');
    await Promise.all(this.inputs.map(async input => {
      await this.compiler.sys.writeFile(input.name, input.code);
    }));

    const diagnostics = await this.compiler.loadConfig({
      devMode: true,
      outputTargets: [
        { type: this.selectedTarget as any }
      ]
    });
    logDiagnostics(diagnostics);

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

    await watcher.start();
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

// const localDevPlugin = (repl: StencilRepl) => {
//   if (!repl.stencilUrl) {
//     return null;
//   }
//   const fetchText = new Map<string, string>();
//   return {
//     resolveId: async (importee: string, importer: string) => {
//       if (importee.includes('@stencil') || (importer && importer.includes('@stencil'))) {
//         if (importee.startsWith('@stencil')) {
//           importee = repl.stencilUrl + importee;
//         }
//         // if (importer && !path.isAbsolute(importee)) {
//         //   const importerDir = path.dirname(importer);
//         //   importee = path.resolve(importerDir, importee);
//         // }
//         if (importee === '/@stencil/core/internal/client') {
//           importee = '/@stencil/core/internal/client/index';
//         }
//         if (!importee.endsWith('.mjs')) {
//           importee += '.mjs';
//         }
//         if (!fetchText.has(importee)) {
//           const rsp = await fetch(importee);
//           const text = await rsp.text();
//           fetchText.set(importee, text);
//         }
//         return importee;
//       }
//     },
//     load: (id: string) => {
//       if (fetchText.has(id)) {
//         return fetchText.get(id);
//       }
//     }
//   }
// };

const logDiagnostics = (diagnostics: d.Diagnostic[]) => {
  diagnostics.forEach(d => {
    if (d.level === 'error') {
      console.error(d.messageText);
    } else if (d.level === 'warn') {
      console.warn(d.messageText);
    } else {
      console.info(d.messageText);
    }
  });
};

export interface InputFile {
  name: string;
  code?: string;
}

export interface OutputFile {
  name: string;
  code: string;
}
