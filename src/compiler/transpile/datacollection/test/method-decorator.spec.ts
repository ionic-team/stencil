import { gatherMetadata } from './test-utils';
import { getMethodDecoratorMeta } from '../method-decorator';
import * as path from 'path';


describe('method decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/method-example');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getMethodDecoratorMeta([], checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      create: {
        memberType: 6,
        attribType: {
          text: '(opts?: any) => any',
          typeReferences: {
            ActionSheet: {
              referenceLocation: 'global',
            },
            ActionSheetOptions: {
              referenceLocation: 'global',
            },
            Promise: {
              referenceLocation: 'global',
            }
          }
        },
        jsdoc: {
          documentation: 'Create method for something',
          name: 'create',
          type: '(opts?: any) => any',
        }
      }
    });
  });

  it('simple decorator with param type', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/method-example-w-export-interface');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getMethodDecoratorMeta([], checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      create: {
        memberType: 6,
        attribType: {
          text: '(opts?: ActionSheetOptions) => any',
          typeReferences: {
            ActionSheetOptions: {
              referenceLocation: 'local',
            },
            Promise: {
              referenceLocation: 'global',
            }
          }
        },
        jsdoc: {
          documentation: 'Create method for something',
          name: 'create',
          type: '(opts?: ActionSheetOptions) => any',
        }
      }
    });
  });

  it('simple decorator with param type imported', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/method-example-w-external-type-import');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getMethodDecoratorMeta([], checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      create: {
        memberType: 6,
        attribType: {
          text: '(opts?: t.CoreContext) => any',
          typeReferences: {
            Promise: {
              referenceLocation: 'global',
            }
          }
        },
        jsdoc: {
          documentation: 'Create method for something',
          name: 'create',
          type: '(opts?: CoreContext) => any'
        }
      }
    });
  });
});
