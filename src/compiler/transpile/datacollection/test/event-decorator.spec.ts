import { convertOptionsToMeta, getEventDecoratorMeta, getEventName } from '../event-decorator';
import { EventOptions } from '../../../../declarations';
import { gatherMetadata } from './test-utils';
import { MEMBER_TYPE } from '../../../../util/constants';
import { mockConfig } from '../../../../testing/mocks';
import * as path from 'path';
import * as ts from 'typescript';


describe('event decorator', () => {

  const config = mockConfig();

  describe('getEventName', () => {

    it('should get given event name, with PascalCase', () => {
      const ev = getEventName(config, { eventName: 'EventWithDashes' }, 'methodName');
      expect(ev).toBe('EventWithDashes');
    });

    it('should get given event name, with-dashes', () => {
      const ev = getEventName(config, { eventName: 'event-with-dashes' }, 'methodName');
      expect(ev).toBe('event-with-dashes');
    });

    it('should use methodName when no given eventName', () => {
      const ev = getEventName(config, {}, 'methodName');
      expect(ev).toBe('methodName');
    });

  });

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/event-simple');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getEventDecoratorMeta(config, checker, classNode, sourceFile);
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
          name: 'event-emitted',
          type: 'EventEmitter<any>'
        }
      }
    ]);
  });

  it('simple decorator', () => {
    let response;
    const sourceFilePath = path.resolve(__dirname, './fixtures/event-example');
    const metadata = gatherMetadata(sourceFilePath, (checker, classNode, sourceFile) => {
      response = getEventDecoratorMeta(config, checker, classNode, sourceFile);
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
          type: 'EventEmitter<any>'
        }
      }
    ]);
  });

  describe('convertOptionsToMeta', () => {
    it('should return null if methodName is null', () => {
      expect(convertOptionsToMeta(config, {}, null)).toBeNull();
    });

    it('should return default EventMeta', () => {
      expect(convertOptionsToMeta(config, {}, 'myEvent')).toEqual({
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
      expect(convertOptionsToMeta(config, eventOptions, 'myEvent')).toEqual({
        eventBubbles: false,
        eventCancelable: false,
        eventComposed: false,
        eventMethodName: 'myEvent',
        eventName: 'my-name'});
    });
  });

});
