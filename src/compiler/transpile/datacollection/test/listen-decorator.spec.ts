import { MEMBER_TYPE } from '../../../../util/constants';
import { getListenDecoratorMeta } from '../listen-decorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './test-utils';

describe('listen decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/listen-simple');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
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
          type: '() => void',
        },
      }
    ]);
  });

});
