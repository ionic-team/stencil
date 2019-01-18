import * as d from '@declarations';
import { convertOptionsToMeta, getEventDecoratorMeta, getEventName } from '../event-decorator';
import { gatherMetadata } from './test-utils';
import * as path from 'path';


describe('event decorator', () => {

  describe('getEventName', () => {

    it('should get given event name, with PascalCase', () => {
      const ev = getEventName([], { eventName: 'EventWithDashes' }, 'methodName');
      expect(ev).toBe('EventWithDashes');
    });

    it('should get given event name, with-dashes', () => {
      const ev = getEventName([], { eventName: 'event-with-dashes' }, 'methodName');
      expect(ev).toBe('event-with-dashes');
    });

    it('should use methodName when no given eventName', () => {
      const ev = getEventName([], {}, 'methodName');
      expect(ev).toBe('methodName');
    });

  });

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/event-simple');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getEventDecoratorMeta([], checker, classNode, sourceFile);
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
          tags: [{
            name: 'param',
            text: 'opts action sheet options'
          }],
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
          name: 'event-emitted',
          tags: [],
          type: 'EventEmitter<any>'
        }
      }
    ]);
  });

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/event-example');
    gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getEventDecoratorMeta([], checker, classNode, sourceFile);
    });

    expect(response).toEqual([
      {
        eventBubbles: false,
        eventCancelable: false,
        eventComposed: false,
        eventMethodName: 'ionGestureMove',
        eventName: 'my-event-name',
        jsdoc: {
          documentation: 'Create event for something',
          name: 'my-event-name',
          tags: [],
          type: 'EventEmitter<any>'
        }
      }
    ]);
  });

  describe('convertOptionsToMeta', () => {
    it('should return null if methodName is null', () => {
      expect(convertOptionsToMeta([], {}, null)).toBeNull();
    });

    it('should return default EventMeta', () => {
      expect(convertOptionsToMeta([], {}, 'myEvent')).toEqual({
        eventBubbles: true,
        eventCancelable: true,
        eventComposed: true,
        eventMethodName: 'myEvent',
        eventName: 'myEvent'});
    });

    it('should configure EventMeta', () => {
      const eventOptions: d.EventOptions = {
        eventName: 'my-name',
        bubbles: false,
        cancelable: false,
        composed: false
      };
      expect(convertOptionsToMeta([], eventOptions, 'myEvent')).toEqual({
        eventBubbles: false,
        eventCancelable: false,
        eventComposed: false,
        eventMethodName: 'myEvent',
        eventName: 'my-name'});
    });

  });

});
