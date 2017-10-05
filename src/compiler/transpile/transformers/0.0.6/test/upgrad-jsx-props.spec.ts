import { BuildConfig, Diagnostic, ModuleFiles, ModuleFile, ComponentMeta } from '../../../../../util/interfaces';
import { mockBuildConfig } from '../../../../../testing/mocks';
import { DEFAULT_COMPILER_OPTIONS } from '../../compiler-options';
import * as ts from 'typescript';


function customJsxTransform(source, fileMetaArray: ModuleFiles) {
  const config = mockBuildConfig();

  return ts.transpileModule(source, {
    transformers: {
        before: []
    },
    compilerOptions: Object.assign({}, DEFAULT_COMPILER_OPTIONS, {
      target: ts.ScriptTarget.ES2017
    })
  }).outputText;
}

describe('vnode-slot transform', () => {
  let fileMetaArray: ModuleFiles;

  beforeEach(() => {
    fileMetaArray = {
      'module.tsx': {
        tsFilePath: '/path/module.tsx',
        cmpMeta: {
        }
      }
    };
  });

  describe('baseline tests for component decorators', () => {
    it('should gather the correct metadata', async () => {
      const source = `
        import { Component, Prop } from '@stencil/core';
        import { ActiveRouter, RouterHistory } from '../../global/interfaces';

        @Component({
          tag: 'stencil-router-redirect'
        })
        export class Redirect {
          @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
          @Prop() url: string;

          componentWillLoad() {
            const history: RouterHistory = this.activeRouter.get('history');
            if (!history) {
              return;
            }
            return history.replace(this.url, {});
          }
        }
      `
      ;
      customJsxTransform(source, fileMetaArray);

      expect(fileMetaArray).toEqual({
        'module.tsx': {
          cmpMeta: {
            componentClass: 'Redirect',
            eventsMeta: [],
            hostMeta: {},
            isShadowMeta: false,
            listenersMeta: [],
            membersMeta: {
              activeRouter: {
                ctrlId: 'activeRouter',
                memberType: 3,
              },
              url: {
                attribName: 'url',
                memberType: 1,
              },
            },
            propsDidChangeMeta: [],
            propsWillChangeMeta: [],
            tagNameMeta: 'stencil-router-redirect',
          },
          tsFilePath: '/path/module.tsx',
        },
      });
    });
