import { ENCAPSULATION } from '../../../../util/constants';
import { visitClass } from '../index';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './testUtils';

describe('component decorator', () => {

  describe('getComponentDecoratorMeta', () => {
    it('simple decorator', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-example');
      const metadata = gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
        response = visitClass(checker, classNode, sourceFile, diagnostics);
      });

      expect(response).toEqual({
        'componentClass': 'ActionSheet',
        'encapsulation': 0,
        'assetsDirsMeta': [],
        'eventsMeta': [
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetDidLoad',
            'eventName': 'ionActionSheetDidLoad',
            'jsdoc': {
              'documentation': '',
              'name': 'ionActionSheetDidLoad',
              'type': 'EventEmitter',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetDidPresent',
            'eventName': 'ionActionSheetDidPresent',
            'jsdoc': {
              'documentation': '',
              'name': 'ionActionSheetDidPresent',
              'type': 'EventEmitter',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetWillPresent',
            'eventName': 'ionActionSheetWillPresent',
            'jsdoc': {
              'documentation': '',
              'name': 'ionActionSheetWillPresent',
              'type': 'EventEmitter',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetWillDismiss',
            'eventName': 'ionActionSheetWillDismiss',
            'jsdoc': {
              'documentation': '',
              'name': 'ionActionSheetWillDismiss',
              'type': 'EventEmitter',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetDidDismiss',
            'eventName': 'ionActionSheetDidDismiss',
            'jsdoc': {
              'documentation': '',
              'name': 'ionActionSheetDidDismiss',
              'type': 'EventEmitter',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetDidUnload',
            'eventName': 'ionActionSheetDidUnload',
            'jsdoc': {
              'documentation': '',
              'name': 'ionActionSheetDidUnload',
              'type': 'EventEmitter',
            },
          },
        ],
        'hostMeta': {
          'theme': 'action-sheet',
        },
        'jsdoc': {
          'documentation': 'This is an actionSheet class',
          'name': 'ActionSheet',
          'type': 'typeof ActionSheet',
        },
        'listenersMeta': [
          {
            'eventCapture': false,
            'eventDisabled': false,
            'eventMethodName': 'onDismiss',
            'eventName': 'ionDismiss',
            'eventPassive': false,
            'jsdoc': {
              'documentation': '',
              'name': 'onDismiss',
              'type': '(ev: any) => void',
            },
          },
        ],
        'membersMeta': {
          'actionSheetId': {
            'attribName': 'actionSheetId',
            'attribType': {
              'text': 'string',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'actionSheetId',
              'type': 'string',
            },
            'memberType': 1,
            'propType': 2,
          },
          'animationCtrl': {
            'ctrlId': 'ion-animation-controller',
            'memberType': 4,
          },
          'buttons': {
            'attribName': 'buttons',
            'attribType': {
              'text': 'ActionSheetButton[]',
              'typeReferences': {
                'ActionSheetButton': {
                  'referenceLocation': 'local',
                },
              },
            },
            'jsdoc': {
              'documentation': '',
              'name': 'buttons',
              'type': '{}',
            },
            'memberType': 1,
            'propType': 1,
          },
          'config': {
            'ctrlId': 'config',
            'memberType': 3,
          },
          'cssClass': {
            'attribName': 'cssClass',
            'attribType': {
              'text': 'string',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'cssClass',
              'type': 'string',
            },
            'memberType': 1,
            'propType': 2,
          },
          'el': {
            'memberType': 7,
          },
          'enableBackdropDismiss': {
            'attribName': 'enableBackdropDismiss',
            'attribType': {
              'text': 'boolean',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'enableBackdropDismiss',
              'type': 'boolean',
            },
            'memberType': 1,
            'propType': 3,
          },
          'enterAnimation': {
            'attribName': 'enterAnimation',
            'attribType': {
              'text': 'AnimationBuilder',
              'typeReferences': {
                'AnimationBuilder': {
                  'importReferenceLocation': '../../index',
                  'referenceLocation': 'import',
                },
              },
            },
            'jsdoc': {
              'documentation': '',
              'name': 'enterAnimation',
              'type': 'any',
            },
            'memberType': 1,
            'propType': 1,
          },
          'exitAnimation': {
            'attribName': 'exitAnimation',
            'attribType': {
              'text': 'AnimationBuilder',
              'typeReferences': {
                'AnimationBuilder': {
                  'importReferenceLocation': '../../index',
                  'referenceLocation': 'import',
                },
              },
            },
            'jsdoc': {
              'documentation': '',
              'name': 'exitAnimation',
              'type': 'any',
            },
            'memberType': 1,
            'propType': 1,
          },
          'subTitle': {
            'attribName': 'subTitle',
            'attribType': {
              'text': 'string',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'subTitle',
              'type': 'string',
            },
            'memberType': 1,
            'propType': 2,
          },
          'title': {
            'attribName': 'title',
            'attribType': {
              'text': 'string',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'title',
              'type': 'string',
            },
            'memberType': 1,
            'propType': 2,
          },
        },
        'stylesMeta': {
          'ios': {
            'originalComponentPaths': [
              'action-sheet.ios.scss',
            ],
          },
          'md': {
            'originalComponentPaths': [
              'action-sheet.md.scss',
            ],
          },
        },
        'tagNameMeta': 'ion-action-sheet'
      });
    });
  });

});
