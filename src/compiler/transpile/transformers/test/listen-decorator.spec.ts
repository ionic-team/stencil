import { ListenOptions, ModuleFile } from '../../../../util/interfaces';
import { isValidElementRefPrefix, isValidKeycodeSuffix, validateListener } from '../listen-decorator';


describe('listen decorator', () => {

  describe('validateListener', () => {

    it('should set disabled true', () => {
      const eventName = 'click';
      const rawListenOpts: ListenOptions = { enabled: false };
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventDisabled).toBe(true);
    });

    it('should set disabled false', () => {
      const eventName = 'click';
      const rawListenOpts: ListenOptions = { enabled: true };
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventDisabled).toBe(false);
    });

    it('should default disabled false', () => {
      const eventName = 'click';
      const rawListenOpts: ListenOptions = {};
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventDisabled).toBe(false);
    });

    it('should set passive false', () => {
      const eventName = 'click';
      const rawListenOpts: ListenOptions = { passive: false };
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventPassive).toBe(false);
    });

    it('should set passive true', () => {
      const eventName = 'click';
      const rawListenOpts: ListenOptions = { passive: true };
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventPassive).toBe(true);
    });

    it('should default passive true for recommended passive event', () => {
      const eventName = 'document:scroll';
      const rawListenOpts: ListenOptions = {};
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventPassive).toBe(true);
    });

    it('should default passive false for non-recommended passive event', () => {
      const eventName = 'click';
      const rawListenOpts: ListenOptions = {};
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventPassive).toBe(false);
    });

    it('should set capture false', () => {
      const eventName = 'click';
      const rawListenOpts: ListenOptions = {
        capture: false
      };
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventCapture).toBe(false);
    });

    it('should default capture false', () => {
      const eventName = 'click';
      const rawListenOpts: ListenOptions = {};
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventCapture).toBe(false);
    });

    it('should get event name w/ suffix', () => {
      const eventName = 'keyup.enter';
      const rawListenOpts: ListenOptions = {};
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventName).toBe('keyup.enter');
    });
    it('should get event name w/ prefix', () => {
      const eventName = 'document:mousemove';
      const rawListenOpts: ListenOptions = {};
      const r = validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      expect(r.eventName).toBe('document:mousemove');
    });

    it('should not allow invalid keycode suffix', () => {
      const eventName = 'keycode.invalid';
      const rawListenOpts: ListenOptions = {};

      expect(() => {
        validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      }).toThrowError(/invalid @Listen suffix/);
    });

    it('should only contain one period', () => {
      const eventName = 'numerous.periods.event';
      const rawListenOpts: ListenOptions = {};

      expect(() => {
        validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      }).toThrowError(/only contain one period/);
    });

    it('should not allow invalid prefix', () => {
      const eventName = 'invalidprefix:scroll';
      const rawListenOpts: ListenOptions = {};

      expect(() => {
        validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      }).toThrowError(/invalid @Listen prefix/);
    });

    it('should only contain one colon', () => {
      const eventName = 'numerous:colon:event';
      const rawListenOpts: ListenOptions = {};

      expect(() => {
        validateListener(fileMeta, eventName, rawListenOpts, methodName, memberNode);
      }).toThrowError(/only contain one colon/);
    });

    it('should return null when no event name', () => {
      const rawListenOpts: ListenOptions = {};
      let r = validateListener(fileMeta, '', rawListenOpts, methodName, memberNode);
      expect(r).toBe(null);

      r = validateListener(fileMeta, null, rawListenOpts, methodName, memberNode);
      expect(r).toBe(null);
    });

    var fileMeta: ModuleFile = {};
    var methodName = 'myMethod';
    var memberNode: any = {};

  });


  describe('isValidKeycodeSuffix', () => {

    it('should not allow invalid suffix', () => {
      expect(isValidKeycodeSuffix('invalid')).toBe(false);
    });

    it('should allow "enter"', () => {
      expect(isValidKeycodeSuffix('enter')).toBe(true);
    });

    it('should allow "escape"', () => {
      expect(isValidKeycodeSuffix('escape')).toBe(true);
    });

    it('should allow "space"', () => {
      expect(isValidKeycodeSuffix('space')).toBe(true);
    });

    it('should allow "tab"', () => {
      expect(isValidKeycodeSuffix('tab')).toBe(true);
    });

    it('should allow "up"', () => {
      expect(isValidKeycodeSuffix('up')).toBe(true);
    });

    it('should allow "right"', () => {
      expect(isValidKeycodeSuffix('right')).toBe(true);
    });

    it('should allow "down"', () => {
      expect(isValidKeycodeSuffix('down')).toBe(true);
    });

    it('should allow "left"', () => {
      expect(isValidKeycodeSuffix('left')).toBe(true);
    });

  });


  describe('isValidElementRefPrefix', () => {

    it('should not allow invalid value', () => {
      expect(isValidElementRefPrefix('invalid')).toBe(false);
    });

    it('should allow "child"', () => {
      expect(isValidElementRefPrefix('child')).toBe(true);
    });

    it('should allow "parent"', () => {
      expect(isValidElementRefPrefix('parent')).toBe(true);
    });

    it('should allow "body"', () => {
      expect(isValidElementRefPrefix('body')).toBe(true);
    });

    it('should allow "document"', () => {
      expect(isValidElementRefPrefix('document')).toBe(true);
    });

    it('should allow "window"', () => {
      expect(isValidElementRefPrefix('window')).toBe(true);
    });

  });

});
