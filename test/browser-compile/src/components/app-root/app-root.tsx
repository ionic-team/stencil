import { Component, Host, h, State } from '@stencil/core';
import { templates } from './templates';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  file: HTMLInputElement;
  sourceCodeInput: HTMLTextAreaElement;
  htmlCodeInput: HTMLTextAreaElement;
  metadata: HTMLSelectElement;
  module: HTMLSelectElement;
  script: HTMLSelectElement;
  output: HTMLSelectElement;
  styleImport: HTMLSelectElement;
  build: HTMLSelectElement;
  fileTemplate: HTMLSelectElement;
  iframe: HTMLIFrameElement;

  fetchPromises: Promise<any>;
  fs = new Map<string, string>();
  resolveLookup = new Map<string, string>();
  wrap = 'off';

  @State() transpiledCode = '';
  @State() bundledCode = '';
  @State() buildView: 'transpiled' | 'bundled' = 'transpiled';
  @State() minified: 'uncompressed' | 'pretty' | 'minified' = 'uncompressed';
  @State() diagnostics: any = [];

  async componentWillLoad() {
    this.resolveLookup.set('@stencil/core/internal/client', '/@stencil/core/internal/client.mjs');
    this.resolveLookup.set('@stencil/core/internal/build-conditionals', '/@stencil/core/internal/build-conditionals.mjs');

    const browserCompiler = await loadDep('/@stencil/core/compiler/browser.js');

    browserCompiler;
    const deps = Promise.all([
      loadDep('https://unpkg.com/terser@4.1.2/dist/bundle.js'),
      loadDep(`https://unpkg.com/rollup@1.17.0/dist/rollup.browser.js`),
      loadDep(`https://unpkg.com/typescript@3.5.3/lib/typescript.js`),
    ]);

    return Promise.all([
      await fetch('/@stencil/core/internal/client.mjs'),
      await fetch('/@stencil/core/internal/build-conditionals.mjs'),
      await fetch('/@stencil/core/internal/css-shim.mjs'),
      await fetch('/@stencil/core/internal/dom.mjs'),
      await fetch('/@stencil/core/internal/shadow-css.mjs'),

    ]).then(results => {
      console.log(4)
      return Promise.all(results.map(async r => {
        const file = (new URL(r.url)).pathname;
        const code = await r.text();
        this.fs.set(file, code);
      }));
    }).then(() => {
      return deps;
    });
  }

  componentDidLoad() {
    this.file.value = this.fileTemplate.value;
    const tmp = templates.get('hello-world.tsx');
    this.sourceCodeInput.value = tmp.source.trim();
    this.htmlCodeInput.value = tmp.html.trim();
    this.compile();
  }

  async compile() {
    console.clear();
    console.log(`compile: stencil v${stencil.version}, typescript v${ts.version}`);

    await this.fetchPromises;

    const opts = {
      file: this.file.value,
      metadata: this.metadata.value,
      mode: 'dev',
      module: this.module.value,
      output: this.output.value,
      script: this.script.value,
      styleImport: this.styleImport.value,
    };

    const results = await stencil.compile(this.sourceCodeInput.value, opts);

    this.transpiledCode = results.code;
    this.diagnostics = results.diagnostics;
    this.wrap = 'off';

    this.diagnostics.forEach((d: any) => {
      if (d.level === 'error') {
        console.error(d.messageText);
      } else if  (d.level === 'warn') {
        console.warn(d.messageText);
      } else {
        console.info(d.messageText);
      }
    });

    await this.bundle();
  }

  async bundle() {
    console.log(`bundle: rollup v${rollup.VERSION}`);

    let entryId = this.file.value;
    if (!entryId.startsWith('/')) {
      entryId = '/' + entryId;
    }

    this.fs.set(entryId, this.transpiledCode);

    const inputOptions = {
      input: entryId,
      plugins: [{
				resolveId: (importee: string, importer: string) => {
          console.log('bundle resolveId, importee:', importee, 'importer:', importer);

          if (importee.startsWith('.')) {
            var u = new URL(importee, 'http://url.resolve' + (importer || ''));
            console.log('bundle path resolve:', u.pathname);
            return u.pathname;
          }

          const resolved = this.resolveLookup.get(importee);
          if (resolved) {
            console.log('bundle resolveLookup:', resolved);
            return resolved;
          }
          return importee;
				},
				load: (id: string) => {
          console.log('bundle load:', id);
          const code = this.fs.get(id);
					return code;
				}
      }],
      onwarn(warning: any) {
				console.group(warning.loc ? warning.loc.file : '');
				console.warn(warning.message);
				if ( warning.frame ) {
					console.log(warning.frame);
				}
				if ( warning.url ) {
					console.log(`See ${warning.url} for more information`);
				}
				console.groupEnd();
			}
    };

    const generateOptions = {
      format: this.module.value,
    };

    const build = await rollup.rollup(inputOptions);
    const generated = await build.generate(generateOptions);

    this.bundledCode = generated.output[0].code;
    this.wrap = 'off';

    if (this.minified === 'minified') {
      const opts = {};
      const results = Terser.minify(this.bundledCode, opts);
      this.bundledCode = results.code;
      this.wrap = 'on';

    } else if (this.minified === 'pretty') {
      const opts = {};
      const results = Terser.minify(this.bundledCode, opts);
      this.bundledCode = results.code;
    }

    this.preview();
  }

  preview() {
    this.iframe.contentWindow.location.reload();

    setTimeout(() => {
      const doc = this.iframe.contentDocument;

      const script = doc.createElement('script');
      script.setAttribute('type', 'module');
      script.innerHTML = [
        '(function(){',
        this.bundledCode,
        '})()'
      ].join('\n');

      doc.head.appendChild(script);

      doc.body.innerHTML = '<hello-world></hello-world>';
    })

  }

  render() {
    return (
      <Host>

        <section class="source">
          <header>Source</header>
          <textarea
            spellCheck={false}
            wrap="off"
            autocapitalize="off"
            ref={el => this.sourceCodeInput = el}
            onInput={() => {
              this.compile();
            }}/>

          <div class="options">
            <label>
              <span>Templates:</span>
              <select ref={el => this.fileTemplate = el} onInput={(ev: any) => {
                this.file.value = ev.target.value;
                const tmp = templates.get(this.file.value);
                this.sourceCodeInput.value = tmp.source.trim();
                this.htmlCodeInput.value = tmp.html.trim();
                this.compile();
              }}>
                <option value="hello-world.tsx">Hello World</option>
                <option value="my-name.tsx">My Name</option>
              </select>
            </label>
            <label>
              <span>File:</span>
              <input ref={el => this.file = el} onInput={this.compile.bind(this)}/>
            </label>
            <label>
              <span>Output:</span>
              <select ref={el => this.output = el} onInput={this.compile.bind(this)}>
                <option value="customelement">customelement</option>
                <option value="module">module</option>
              </select>
            </label>
            <label>
              <span>Module:</span>
              <select ref={el => this.module = el} onInput={this.compile.bind(this)}>
                <option value="esm">esm</option>
                <option value="cjs">cjs</option>
              </select>
            </label>
            <label>
              <span>Script:</span>
              <select ref={el => this.script = el} onInput={this.compile.bind(this)}>
                <option value="latest">latest</option>
                <option value="esnext">esnext</option>
                <option value="es2017">es2017</option>
                <option value="es2015">es2015</option>
                <option value="es5">es5</option>
              </select>
            </label>
            <label>
              <span>Style Import:</span>
              <select ref={el => this.styleImport = el} onInput={this.compile.bind(this)}>
                <option value="inline">inline</option>
                <option value="cjs">cjs</option>
                <option value="esm">esm</option>
              </select>
            </label>
            <label>
              <span>Metadata:</span>
              <select ref={el => this.metadata = el} onInput={this.compile.bind(this)}>
                <option value="proxy">proxy</option>
                <option value="static">static</option>
              </select>
            </label>
          </div>
        </section>

        <section class="build" hidden={this.diagnostics.length > 0}>
          <header>{this.buildView === 'transpiled' ? 'Transpiled Build' : 'Bundled Build'}</header>

          <textarea
            hidden={this.buildView !== 'transpiled'}
            spellCheck={false}
            autocapitalize="off"
            wrap="off"
            >{this.transpiledCode}</textarea>

          <textarea
            hidden={this.buildView !== 'bundled'}
            spellCheck={false}
            autocapitalize="off"
            wrap={this.wrap}
            >{this.bundledCode}</textarea>

          <div class="options">
            <label>
              <span>Build:</span>
              <select ref={el => this.build = el} onInput={(ev: any) => {
                this.buildView = ev.target.value;
              }}>
                <option value="transpiled">Transpiled</option>
                <option value="bundled">Bundled</option>
              </select>
            </label>

            <label hidden={this.buildView !== 'bundled'}>
              <span>Minify:</span>
              <select onInput={(ev: any) => {
                this.minified = ev.target.value;
                this.bundle();
              }}>
                <option value="uncompressed">Uncompressed</option>
                <option value="pretty">Pretty Minified</option>
                <option value="minified">Minified</option>
              </select>
              <span class="file-size">
                {this.bundledCode.length}b
              </span>
            </label>
          </div>
        </section>

        <section class="diagnostics" hidden={this.diagnostics.length === 0}>
          <header>Diagnostics</header>
          {this.diagnostics.map((d: any) => (
            <div>
              {d.messageText}
            </div>
          ))}
        </section>

        <section class="preview">
          <header>HTML</header>
            <textarea
              spellCheck={false}
              wrap="off"
              autocapitalize="off"
              ref={el => this.htmlCodeInput = el}
            />
            <div class="options">

            </div>

          <div class="view">
            <header>Preview</header>
            <iframe ref={el => this.iframe = el}></iframe>
          </div>
        </section>

      </Host>
    )
  }

}


const loadDep = (url: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.onload = () => {
      console.log('loaded')
      setTimeout(resolve);
    };
    script.onerror = reject;
    script.src = url;
    document.head.appendChild(script);
  });
};


declare const stencil: any;
declare const ts: any;
declare const rollup: any;
declare const Terser: any;
