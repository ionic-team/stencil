import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../../../util/constants';
import { gatherMetadata } from './test-utils';
import { mockConfig } from '../../../../testing/mocks';
import { visitClass } from '../index';
import * as path from 'path';
import * as ts from 'typescript';


describe('component decorator', () => {

  const config = mockConfig();

  describe('getComponentDecoratorMeta', () => {
    it('simple decorator', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-example');
      const metadata = gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
        response = visitClass(config, checker, classNode, sourceFile, diagnostics);
      });

      expect(response).toEqual({
        'componentClass': 'ActionSheet',
        'encapsulation': ENCAPSULATION.NoEncapsulation,
        'assetsDirsMeta': [],
        'dependencies': [],
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
              'type': 'any',
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
              'type': 'any',
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
              'type': 'any',
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
              'type': 'any',
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
              'type': 'any',
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
              'type': 'any',
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
            'attribName': 'action-sheet-id',
            'attribType': {
              'text': 'string',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'actionSheetId',
              'type': 'string',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.String,
          },
          'animationCtrl': {
            'ctrlId': 'ion-animation-controller',
            'memberType': MEMBER_TYPE.PropConnect,
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
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.Unknown,
          },
          'config': {
            'ctrlId': 'config',
            'memberType': MEMBER_TYPE.PropContext,
          },
          'cssClass': {
            'attribName': 'css-class',
            'attribType': {
              'text': 'string',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'cssClass',
              'type': 'string',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.String,
          },
          'el': {
            'memberType': MEMBER_TYPE.Element,
          },
          'enableBackdropDismiss': {
            'attribName': 'enable-backdrop-dismiss',
            'attribType': {
              'text': 'boolean',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'enableBackdropDismiss',
              'type': 'boolean',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.Boolean,
          },
          'enterAnimation': {
            'attribName': 'enter-animation',
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
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.Unknown,
          },
          'exitAnimation': {
            'attribName': 'exit-animation',
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
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.Unknown,
          },
          'subTitle': {
            'attribName': 'sub-title',
            'attribType': {
              'text': 'string',
            },
            'jsdoc': {
              'documentation': '',
              'name': 'subTitle',
              'type': 'string',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.String,
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
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.String,
          },
        },
        'stylesMeta': {
          'ios': {
            'externalStyles': [
              {
                'originalComponentPath': 'action-sheet.ios.scss'
              }
            ]
          },
          'md': {
            'externalStyles': [
              {
                'originalComponentPath': 'action-sheet.md.scss'
              }
            ]
          },
        },
        'tagNameMeta': 'ion-action-sheet'
      });
    });
  });

});
