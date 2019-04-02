import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../../../util/constants';
import { gatherMetadata } from './test-utils';
import { visitClass } from '../gather-metadata';
import * as path from 'path';
import { mockConfig } from '../../../../testing/mocks';


describe('component', () => {

  describe('getComponentDecoratorMeta', () => {

    it('complex decorator', () => {
      let response;
      const sourceFilePath = path.resolve(__dirname, './fixtures/component-example');
      gatherMetadata(sourceFilePath, (checker, classNode, sourceFile, diagnostics) => {
        response = visitClass(mockConfig(), diagnostics, checker, classNode, sourceFile);
      });

      expect(response).toEqual({
        'componentClass': 'ActionSheet',
        'encapsulationMeta': ENCAPSULATION.NoEncapsulation,
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
              'tags': [{
                'name': 'output',
                'text': '{ActionSheetEvent} Emitted after the alert has loaded.'
              }],
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
              'tags': [],
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
              'tags': [],
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
              'tags': [],
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
              'tags': [],
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
              'tags': [],
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
          'tags': [],
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
              'tags': [],
              'type': '(ev: any) => void',
            },
          },
        ],
        'membersMeta': {
          'actionSheetId': {
            'attribName': 'action-sheet-id',
            'attribType': {
              'text': 'string',
              'optional': false,
              'required': false,
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'actionSheetId',
              'tags': [{
                'name': 'internal',
                'text': undefined,
              }],
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
              'optional': false,
              'required': false,
              'typeReferences': {
                'ActionSheetButton': {
                  'referenceLocation': 'local',
                },
              },
            },
            'jsdoc': {
              'documentation': '',
              'name': 'buttons',
              'tags': [],
              'type': 'ActionSheetButton[]',
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
              'optional': false,
              'required': false,
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'cssClass',
              'tags': [],
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
              'optional': false,
              'required': false,
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'enableBackdropDismiss',
              'tags': [],
              'type': 'boolean',
              'default': 'true'
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.Boolean,
            'reflectToAttrib': false,
          },
          'enterAnimation': {
            'attribName': 'enter-animation',
            'attribType': {
              'text': 'AnimationBuilder',
              'optional': false,
              'required': false,
              'typeReferences': {
                'AnimationBuilder': {
                  'referenceLocation': 'global',
                },
              },
            },
            'jsdoc': {
              'documentation': '',
              'name': 'enterAnimation',
              'tags': [],
              'type': 'AnimationBuilder',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.Unknown,
            'reflectToAttrib': false,
          },
          'exitAnimation': {
            'attribName': 'exit-animation',
            'attribType': {
              'text': 'AnimationBuilder',
              'optional': false,
              'required': false,
              'typeReferences': {
                'AnimationBuilder': {
                  'referenceLocation': 'global',
                },
              },
            },
            'jsdoc': {
              'documentation': '',
              'name': 'exitAnimation',
              'tags': [{
                'name': 'return',
                'text': 'this is a property'
              }],
              'type': 'AnimationBuilder',
            },
            'memberType': MEMBER_TYPE.Prop,
            'propType': PROP_TYPE.Unknown,
            'reflectToAttrib': false,
          },
          'subTitle': {
            'attribName': 'sub-title',
            'attribType': {
              'text': 'string',
              'optional': false,
              'required': false,
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'subTitle',
              'tags': [],
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
              'optional': false,
              'required': false,
              'typeReferences': {}
            },
            'jsdoc': {
              'documentation': '',
              'name': 'title',
              'tags': [],
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
