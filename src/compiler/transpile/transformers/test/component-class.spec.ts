import { BuildConfig, Diagnostic, ModuleFiles, ModuleFile, ComponentMeta } from '../../../../util/interfaces';
import { mockBuildConfig } from '../../../../testing/mocks';
import { componentTsFileClass } from '../component-class';
import { DEFAULT_COMPILER_OPTIONS } from '../../compiler-options';
import * as ts from 'typescript';


function customJsxTransform(source, fileMetaArray: ModuleFiles) {
  const config = mockBuildConfig();

  return ts.transpileModule(source, {
    transformers: {
        before: [componentTsFileClass(config, fileMetaArray, [] as Diagnostic[])]
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
    it('should gather the correct metadata', () => {
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

    it('should ignore Decorators that it is not responsible for', () => {
      const source = `
        import { Component, Prop } from '@stencil/core';
        import { ActiveRouter, RouterHistory } from '../../global/interfaces';

        @Component({
          tag: 'stencil-router-redirect'
        })
        export class Redirect {
          @Prop({ context: 'activeRouter' }) activeRouter: ActiveRouter;
          @Prop() url: string;
          @Red blue: string;
          @Green black: string;

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

      expect(customJsxTransform(source, fileMetaArray)).toMatch(/Red/);
      expect(customJsxTransform(source, fileMetaArray)).toMatch(/Green/);
    });
  });
});
