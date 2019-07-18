import { Component, Host, h, State } from '@stencil/core';
import { loadDeps } from './load-deps';
import { templates } from './templates';


@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css'
})
export class AppRoot {

  file: HTMLInputElement;
  sourceCodeInput: HTMLTextAreaElement;
  transpiledInput: HTMLTextAreaElement;
  bundledInput: HTMLTextAreaElement;
  htmlCodeInput: HTMLTextAreaElement;
  componentMetadata: HTMLSelectElement;
  module: HTMLSelectElement;
  script: HTMLSelectElement;
  componentExport: HTMLSelectElement;
  styleImport: HTMLSelectElement;
  build: HTMLSelectElement;
  fileTemplate: HTMLSelectElement;
  iframe: HTMLIFrameElement;

  fs = new Map<string, string>();
  resolveLookup = new Map<string, string>();

  @State() wrap = 'off';
  @State() buildView: 'transpiled' | 'bundled' = 'transpiled';
  @State() minified: 'uncompressed' | 'pretty' | 'minified' = 'uncompressed';
  @State() bundledLength = 0;
  @State() diagnostics: any = [];

  componentWillLoad() {
    return loadDeps(this.resolveLookup, this.fs);
  }

  async componentDidLoad() {
    this.file.value = this.fileTemplate.value;
    const tmp = templates.get('hello-world.tsx');
    this.sourceCodeInput.value = tmp.source.trim();
    this.htmlCodeInput.value = tmp.html.trim();
    this.compile();
  }

  async compile() {
    console.clear();
    console.log(`compile: stencil v${stencil.version}, typescript v${ts.version}`);

    const opts = {
      file: this.file.value,
      componentExport: this.componentExport.value,
      componentMetadata: this.componentMetadata.value,
      module: this.module.value,
      script: this.script.value,
      styleImport: this.styleImport.value
    };

    const results = await stencil.compile(this.sourceCodeInput.value, opts);

    this.transpiledInput.value = results.code;
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

    this.fs.set(entryId, this.transpiledInput.value);

    const inputOptions = {
      input: entryId,
      treeshake: true,
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

    this.bundledInput.value = generated.output[0].code;
    this.wrap = 'off';

    if (this.minified === 'minified') {
      const opts = stencil.getMinifyScriptOptions({
        script: this.script.value,
        pretty: false
      });
      const results = Terser.minify(this.bundledInput.value, opts);
      this.bundledInput.value = results.code;
      this.wrap = 'on';

    } else if (this.minified === 'pretty') {
      const opts = stencil.getMinifyScriptOptions({
        script: this.script.value,
        pretty: true
      });
      const results = Terser.minify(this.bundledInput.value, opts);
      this.bundledInput.value = results.code;
    }

    this.preview();
  }

  preview() {
    this.bundledLength = this.bundledInput.value.length;

    this.iframe.contentWindow.location.reload();

    setTimeout(() => {
      const doc = this.iframe.contentDocument;

      const script = doc.createElement('script');
      script.setAttribute('type', 'module');
      script.innerHTML = [
        '(function(){',
        this.bundledInput.value,
        '})()'
      ].join('\n');

      doc.head.appendChild(script);

      doc.body.innerHTML = this.htmlCodeInput.value;
    });
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
                <option value="my-name.tsx">Properties</option>
                <option value="my-button.tsx">Shadow/Slot</option>
              </select>
            </label>
            <label>
              <span>File:</span>
              <input ref={el => this.file = el} onInput={this.compile.bind(this)}/>
            </label>
            <label>
              <span>Export:</span>
              <select ref={el => this.componentExport = el} onInput={this.compile.bind(this)}>
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
                <option value="es2017">es2017</option>
                <option value="es2015">es2015</option>
                <option value="es5">es5</option>
                <option value="latest">latest</option>
                <option value="esnext">esnext</option>
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
              <select ref={el => this.componentMetadata = el} onInput={this.compile.bind(this)}>
                <option value="proxy">proxy</option>
                <option value="static">static</option>
              </select>
            </label>
          </div>
        </section>

        <section class="build" hidden={this.diagnostics.length > 0}>
          <header>{this.buildView === 'transpiled' ? 'Transpiled Build' : 'Bundled Build'}</header>

          <textarea
            ref={el => this.transpiledInput = el}
            onInput={this.bundle.bind(this)}
            hidden={this.buildView !== 'transpiled'}
            spellCheck={false}
            autocapitalize="off"
            wrap="off"/>

          <textarea
            ref={el => this.bundledInput = el}
            onInput={this.preview.bind(this)}
            hidden={this.buildView !== 'bundled'}
            spellCheck={false}
            autocapitalize="off"
            wrap={this.wrap}/>

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
                {this.bundledLength} b
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
              onInput={this.preview.bind(this)}
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



declare const stencil: any;
declare const ts: any;
declare const rollup: any;
declare const Terser: any;
