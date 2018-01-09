import * as path from 'path';
import * as ts from 'typescript';
import { DEFAULT_COMPILER_OPTIONS } from '../compiler-options';
import { transpileModule } from '../transpile';
import { mockBuildConfig } from '../../../testing/mocks';


describe('component decorator', () => {

  let response;
  var config = mockBuildConfig();

  it('simple test', () => {
    const filePath = path.join(__dirname, 'component.tsx');

    DEFAULT_COMPILER_OPTIONS.target = ts.ScriptTarget.ES2015;
    // DEFAULT_COMPILER_OPTIONS.module = ts.ModuleKind.CommonJS;
    const results = transpileModule(config, DEFAULT_COMPILER_OPTIONS, filePath, ts.sys.readFile(filePath, 'utf8'));
    expect(typeof results.code).toBe('string');
    expect(Object.keys(results.cmpMeta).length).toEqual(10);
  });

});
