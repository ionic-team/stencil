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
      }], 'HTMLMyComponentElement')[0];
    });

    it('should rename event names', () => {
      expect(eventType.name).toEqual('onAction');
    });

    it('should generate the event type with the complex type', () => {
      expect(eventType.type).toContain('CustomEvent<CustomInterface>');
    });

    it('should generate the event type with the custom HTMLElement type', () => {
      expect(eventType.type).toBe('(event: CustomEvent<CustomInterface> & { target: HTMLMyComponentElement }) => void');
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
      }], 'HTMLMyComponentElement')[0];
    });

    it('should rename event names', () => {
      expect(eventType.name).toEqual('onAction');
    });

    it('should generate the event type with the custom HTMLElement type', () => {
      expect(eventType.type).toBe('CustomEvent & { target: HTMLMyComponentElement }');
    });

  });

});
