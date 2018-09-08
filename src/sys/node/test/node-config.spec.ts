import { convertSourceConfig } from '../node-config';


describe('node-config', () => {

  it('should convert esm to commonjs config', () => {
    const sourceText = `
      export const config = {
        namespace: 'my-ts-project'
      }
    `;
    const filePath = 'stencil.config.js';

    const output = convertSourceConfig(sourceText, filePath);

    const r = new Function(`exports`, `${output}`);

    const exports: any = {};
    r(exports);

    expect(exports.config).toBeDefined();
    expect(exports.config.namespace).toBe('my-ts-project');
  });

  it('should not convert commonjs config', () => {
    const sourceText = `
      exports.config = {
        namespace: 'my-ts-project'
      };
    `;
    const filePath = 'stencil.config.js';

    const output = convertSourceConfig(sourceText, filePath);

    const r = new Function(`exports`, `${output}`);

    const exports: any = {};
    r(exports);

    expect(exports.config).toBeDefined();
    expect(exports.config.namespace).toBe('my-ts-project');
  });

  it('should transpile config', () => {
    const sourceText = `
      export const config: any = {
        namespace: 'my-ts-project'
      }
    `;
    const filePath = 'stencil.config.ts';

    const output = convertSourceConfig(sourceText, filePath);

    const r = new Function(`exports`, `${output}`);

    const exports: any = {};
    r(exports);

    expect(exports.config).toBeDefined();
    expect(exports.config.namespace).toBe('my-ts-project');
  });

});
