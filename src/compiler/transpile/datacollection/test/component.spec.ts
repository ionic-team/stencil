import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../../../util/constants';
import { gatherMetadata } from './test-utils';
import { visitClass } from '../gather-metadata';
import * as path from 'path';


describe('component', () => {

  describe('getComponentDecoratorMeta', () => {

    it('complex decorator', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-example');
      gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
        response = visitClass(diagnostics, checker, classNode, sourceFile);
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
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'actionSheetId',
              'type': 'string',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.String,
            'reflectToAttrib': false,
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
            'reflectToAttrib': false,
          },
          'config': {
            'ctrlId': 'config',
            'memberType': MEMBER_TYPE.PropContext,
          },
          'cssClass': {
            'attribName': 'css-class',
            'attribType': {
              'text': 'string',
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'cssClass',
              'type': 'string',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.String,
            'reflectToAttrib': false,
          },
          'el': {
            'memberType': MEMBER_TYPE.Element,
          },
          'enableBackdropDismiss': {
            'attribName': 'enable-backdrop-dismiss',
            'attribType': {
              'text': 'boolean',
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'enableBackdropDismiss',
              'type': 'boolean',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.Boolean,
            'reflectToAttrib': false,
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
            'reflectToAttrib': false,
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
            'reflectToAttrib': false,
          },
          'subTitle': {
            'attribName': 'sub-title',
            'attribType': {
              'text': 'string',
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'subTitle',
              'type': 'string',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.String,
            'reflectToAttrib': true,
          },
          'title': {
            'attribName': 'title',
            'attribType': {
              'text': 'string',
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'title',
              'type': 'string',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.String,
            'reflectToAttrib': false,
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
