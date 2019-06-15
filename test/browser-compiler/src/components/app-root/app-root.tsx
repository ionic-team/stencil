import { Component, Host, h, State } from '@stencil/core';
import { Compiler, Config, Fs } from '@stencil/core/browser';


@Component({
  tag: 'app-root',
  styles: `
    app-root {
      display: flex;
    }
    section {
      flex: 1;
    }
    .output {
      padding: 0 10px 0 20px;;
    }
    .output textarea {
      width: 100%;
      height: 500px;
    }
  `
})
export class AppRoot {

  @State() output = '';

  async loadCompiler() {
    const url = '../compiler/index.js';
    return import(url);
  }

  async componentDidLoad() {
    // lazy load
    this.loadCompiler()
  }

  async build() {
    const { Compiler, Fs } = await this.loadCompiler()

    const fs = new Fs() as Fs;
    fs.mkdirSync('/src');

    FILES.forEach(f => {
      fs.writeFileSync(f.filePath, f.content);
    });

    const config: Config = {
      fs
    };
    const compiler = new Compiler(config) as Compiler;

    compiler.on('buildFinish', results => {
      this.output = JSON.stringify(results, null, 2);
    });

    await compiler.build();
  }


  render() {
    return (
      <Host>
        <section class="src">
          {FILES.map(f => (
            <src-file file={f}></src-file>
          ))}
          <hr/>
          <div>
            <button>Add File</button>
          </div>
        </section>
        <section class="output">
          <div>
            <button onClick={this.build.bind(this)}>Build</button>
          </div>
          <textarea>{this.output}</textarea>
        </section>
      </Host>
    )
  }

}

const FILES = [
  {
    filePath: `/src/cmp-a.tsx`,
    content: `
import { Component } from '@stencil/core';
@Component({
  tag: 'hello-world'
})
class HelloWorld {
  render() {
    return 'Hello World';
  }
}
    `
  }
];
