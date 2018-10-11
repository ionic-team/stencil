import { getListenDecoratorMeta } from '../listen-decorator';
import { gatherMetadata } from './test-utils';
import * as path from 'path';


describe('listen decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/listen-simple');
    gatherMetadata(sourceFilePath, (checker, classNode) => {
      response = getListenDecoratorMeta(checker, classNode);
    });

    expect(response).toEqual([
      {
        eventCapture: false,
        eventDisabled: false,
        eventMethodName: 'viewDidLoad',
        eventName: 'body:ionActionSheetDidLoad',
        eventPassive: false,
        jsdoc: {
          documentation: 'Create listen for something',
          name: 'viewDidLoad',
          tags: [],
          type: '(ev: any) => void',
        },
      },
      {
        eventCapture: false,
        eventDisabled: false,
        eventMethodName: 'method',
        eventName: 'test',
        eventPassive: false,
        jsdoc: {
          documentation: '',
          name: 'method',
          tags: [],
          type: '() => void',
        },
      },
      {
        eventCapture: false,
        eventDisabled: true,
        eventMethodName: 'method',
        eventName: 'test2',
        eventPassive: false,
        jsdoc: {
          documentation: '',
          name: 'method',
          tags: [],
          type: '() => void',
        },
      },
      {
        eventCapture: false,
        eventDisabled: true,
        eventMethodName: 'method',
        eventName: 'test3',
        eventPassive: false,
        jsdoc: {
          documentation: '',
          name: 'method',
          tags: [],
          type: '() => void',
        },
      }
    ]);
  });

});
