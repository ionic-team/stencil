import { gatherMetadata } from './test-utils';
import { getMethodDecoratorMeta } from '../method-decorator';
import * as path from 'path';
import { MEMBER_TYPE } from '@stencil/core/utils';
import { Config } from '../../../../declarations';
import { mockConfig } from '../../../../testing/mocks';


let config: Config;

beforeEach(() => {
  config = mockConfig();
});

describe('method decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/method-example');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getMethodDecoratorMeta(config, [], checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      create: {
        memberType: MEMBER_TYPE.Method,
        attribType: {
          text: '(opts?: any) => any',
          optional: false,
          required: false,
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
          tags: [{
            name: 'param',
            text: 'opts action sheet options'
          }, {
            name: 'returns',
            text: 'action sheet'
          }
          ],
          parameters: [
            {
              documentation: 'action sheet options',
              name: 'opts',
              tags: [{
                name: 'param',
                text: 'opts action sheet options'
              }],
              type: 'any'
            }
          ],
          returns: {
            documentation: 'action sheet',
            type: 'any'
          },
          type: '(opts?: any) => any',
        }
      }
    });
  });

  it('simple decorator with param type', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/method-example-w-export-interface');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getMethodDecoratorMeta(config, [], checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      create: {
        memberType: MEMBER_TYPE.Method,
        attribType: {
          text: '(opts?: ActionSheetOptions) => any',
          optional: false,
          required: false,
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
          tags: [{
            name: 'param',
            text: 'opts action sheet options'
          }],
          parameters: [
            {
              documentation: 'action sheet options',
              name: 'opts',
              tags: [{
                name: 'param',
                text: 'opts action sheet options'
              }],
              type: 'ActionSheetOptions'
            }
          ],
          returns: {
            documentation: '',
            type: 'any'
          },
          type: '(opts?: ActionSheetOptions) => any',
        }
      }
    });
  });

  it('simple decorator with param type imported', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/method-example-w-external-type-import');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getMethodDecoratorMeta(config, [], checker, classNode, sourceFile, 'ClassName');
    });

    expect(response).toEqual({
      create: {
        memberType: MEMBER_TYPE.Method,
        attribType: {
          text: '(opts?: t.CoreContext) => any',
          optional: false,
          required: false,
          typeReferences: {
            Promise: {
              referenceLocation: 'global',
            }
          }
        },
        jsdoc: {
          documentation: 'Create method for something',
          name: 'create',
          tags: [{
            name: 'param',
            text: 'opts action sheet options'
          }],
          parameters: [
            {
              documentation: 'action sheet options',
              name: 'opts',
              tags: [{
                name: 'param',
                text: 'opts action sheet options'
              }],
              type: 'CoreContext'
            }
          ],
          returns: {
            documentation: '',
            type: 'any'
          },
          type: '(opts?: CoreContext) => any'
        }
      }
    });
  });
});
