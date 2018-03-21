import { ENCAPSULATION, MEMBER_TYPE, PROP_TYPE } from '../../../../util/constants';
import { gatherMetadata } from './test-utils';
import { mockConfig } from '../../../../testing/mocks';
import { visitClass } from '../index';
import * as path from 'path';
import * as ts from 'typescript';


describe('component', () => {

  const config = mockConfig();

  describe('getComponentDecoratorMeta', () => {

    it('complex decorator', () => {
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
            'eventName': 'ionactionsheetdidload',
            'jsdoc': {
              'documentation': '',
              'name': 'ionactionsheetdidload',
              'type': 'any',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetDidPresent',
            'eventName': 'ionactionsheetdidpresent',
            'jsdoc': {
              'documentation': '',
              'name': 'ionactionsheetdidpresent',
              'type': 'any',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetWillPresent',
            'eventName': 'ionactionsheetwillpresent',
            'jsdoc': {
              'documentation': '',
              'name': 'ionactionsheetwillpresent',
              'type': 'any',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetWillDismiss',
            'eventName': 'ionactionsheetwilldismiss',
            'jsdoc': {
              'documentation': '',
              'name': 'ionactionsheetwilldismiss',
              'type': 'any',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetDidDismiss',
            'eventName': 'ionactionsheetdiddismiss',
            'jsdoc': {
              'documentation': '',
              'name': 'ionactionsheetdiddismiss',
              'type': 'any',
            },
          },
          {
            'eventBubbles': true,
            'eventCancelable': true,
            'eventComposed': true,
            'eventMethodName': 'ionActionSheetDidUnload',
            'eventName': 'ionactionsheetdidunload',
            'jsdoc': {
              'documentation': '',
              'name': 'ionactionsheetdidunload',
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
            'reflectToAttr': false,
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
            'reflectToAttr': false,
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
            'reflectToAttr': false,
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
            'reflectToAttr': false,
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
            'reflectToAttr': false,
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
            'reflectToAttr': false,
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
            'reflectToAttr': true,
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
            'reflectToAttr': false,
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
