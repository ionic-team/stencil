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

    const results = transpileModule(config, DEFAULT_COMPILER_OPTIONS, filePath, ts.sys.readFile(filePath, 'utf8'));
    expect(typeof results.code).toBe('string');
    expect(results.cmpMeta).toEqual({
      assetsDirsMeta: [],
      componentClass: 'AppProfile',
      encapsulation: 0,
      eventsMeta: [],
      hostMeta: {},
      jsdoc: {
        name: 'AppProfile',
        documentation: '',
        type: 'typeof AppProfile'
      },
      listenersMeta: [],
      membersMeta: {
        match: {
          attribName: 'match',
          attribType: {
            text: 'MatchResults',
            typeReferences: {
              'MatchResults': {
                'importReferenceLocation': '@stencil/router',
                'referenceLocation': 'import'
              }
            }
          },
          jsdoc: {
            documentation: '',
            name: 'match',
            type: 'any',
          },
          memberType: 1,
          propType: 1,
        },
      },
      propsWillChangeMeta: undefined,
      propsDidChangeMeta: undefined,
      stylesMeta: {
        '$': {
          absolutePaths: [
            '/Users/joshthomas/Workspace/stencil/src/compiler/transpile/test/app-profile.scss'
          ],
          cmpRelativePaths: [
            'app-profile.scss'
          ],
          originalComponentPaths: [
            'app-profile.scss'
          ],
        }
      },
      tagNameMeta: 'app-profile'
    });
  });
});
