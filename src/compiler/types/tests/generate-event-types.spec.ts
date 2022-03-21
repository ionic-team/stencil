import { generateEventTypes } from "../generate-event-types";

describe('generateEventTypes', () => {

  describe('when custom event has a complex type', () => {

    let eventType: ReturnType<typeof generateEventTypes>[0];

    beforeEach(() => {
      eventType = generateEventTypes([<any>{
        name: 'action',
        internal: false,
        docs: {
          text: '',
          tags: []
        },
        complexType: {
          original: 'CustomInterface',
        }
      }], 'MyComponent')[0];
    });

    it('should rename event names', () => {
      expect(eventType.name).toEqual('onAction');
    });

    it('should generate the event type with the component event detail and custom type', () => {
      expect(eventType.type).toBe('(event: ComponentEvents.MyComponentEventDetail<CustomInterface>) => void');
    });

  });

  describe('when custom event has a primitive type', () => {

    let eventType: ReturnType<typeof generateEventTypes>[0];

    beforeEach(() => {
      eventType = generateEventTypes([<any>{
        name: 'action',
        internal: false,
        docs: {
          text: '',
          tags: []
        },
        complexType: {}
      }], 'MyComponent')[0];
    });

    it('should rename event names', () => {
      expect(eventType.name).toEqual('onAction');
    });

    it('should generate the event type with the component event detail', () => {
      expect(eventType.type).toBe('ComponentEvents.MyComponentEventDetail');
    });

  });

});
