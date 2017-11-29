import { MEMBER_TYPE } from '../../../../util/constants';
import { getEventDecoratorMeta } from '../eventDecorator';
import * as path from 'path';
import * as ts from 'typescript';
import { gatherMetadata } from './testUtils';

describe('event decorator', () => {

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/event-simple');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      response = getEventDecoratorMeta(checker, classNode);
    });

    expect(response).toEqual([
      {
        eventBubbles: true,
        eventCancelable: true,
        eventComposed: true,
        eventMethodName: 'ionGestureMove',
        eventName: 'ionGestureMove',
        jsdoc: {
          documentation: 'Create method for something',
          name: 'ionGestureMove',
          type: 'EventEmitter<any>'
        }
      }
    ]);
  });

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/event-example');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode) => {
      response = getEventDecoratorMeta(checker, classNode);
    });

    expect(response).toEqual([
      {
        eventBubbles: false,
        eventCancelable: false,
        eventComposed: false,
        eventMethodName: 'ionGestureMove',
        eventName: 'gesture',
        jsdoc: {
          documentation: 'Create event for something',
          name: 'ionGestureMove',
          type: 'EventEmitter<any>'
        }
      }
    ]);
  });

});
