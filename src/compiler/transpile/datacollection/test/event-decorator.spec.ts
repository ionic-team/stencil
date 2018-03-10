import { convertOptionsToMeta, getEventDecoratorMeta } from '../event-decorator';
import { EventOptions } from '../../../../declarations';
import { gatherMetadata } from './test-utils';
import { MEMBER_TYPE } from '../../../../util/constants';
import * as path from 'path';
import * as ts from 'typescript';



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
      },
      {
        eventBubbles: true,
        eventCancelable: true,
        eventComposed: true,
        eventMethodName: 'eventEmitted',
        eventName: 'event-emitted',
        jsdoc: {
          documentation: '',
          name: 'eventEmitted',
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

  describe('convertOptionsToMeta', () => {
    it('should return null if methodName is null', () => {
      expect(convertOptionsToMeta({}, null)).toBeNull();
    });

    it('should return default EventMeta', () => {
      expect(convertOptionsToMeta({}, 'myEvent')).toEqual({
        eventBubbles: true,
        eventCancelable: true,
        eventComposed: true,
        eventMethodName: 'myEvent',
        eventName: 'myEvent'});
    });

    it('should configure EventMeta', () => {
      const eventOptions: EventOptions = {
        eventName: 'my-name',
        bubbles: false,
        cancelable: false,
        composed: false
      };
      expect(convertOptionsToMeta(eventOptions, 'myEvent')).toEqual({
        eventBubbles: false,
        eventCancelable: false,
        eventComposed: false,
        eventMethodName: 'myEvent',
        eventName: 'my-name'});
    });
  });

});
