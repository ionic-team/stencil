import { setAccessor } from '../update-dom-node';
import { mockElement, mockPlatform } from '../../../testing/mocks';

describe('setAccessor', () => {
  const plt: any = mockPlatform();

  it('should set undefined property to child with existing property', () => {
    const oldValue: any = 'someval';
    const newValue: any = undefined;

    Object.defineProperty(elm, 'myprop', {
      set: () => {},
      get: () => 'getterValue'
    });

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe('getterValue');
    expect(elm.hasAttribute('myprop')).toBe(false);

    const propDesc = Object.getOwnPropertyDescriptor(elm, 'myprop');
    expect(propDesc).toBeDefined();
  });

  it('should set object property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = { some: 'obj' };

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set array property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = [1, 2, 3];

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set function property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = function meFun(){};

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set null property to child and it is a child prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = null;
    elm.myprop = oldValue;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set string property to child when child already has that property', () => {
    const oldValue: any = 'someval';
    const newValue: any = 'stringval';
    elm.myprop = oldValue;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBe('stringval');
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should do nothing when setting null prop but child doesnt have that prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = null;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should do nothing when setting undefined prop but child doesnt have that prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = undefined;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.hasAttribute('myprop')).toBe(false);

    const propDesc = Object.getOwnPropertyDescriptor(elm, 'myprop');
    expect(propDesc).toBeUndefined();
  });

  it('should set false boolean to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = false;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.getAttribute('myprop')).toBe('false');
  });

  it('should set true boolean to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = true;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.getAttribute('myprop')).toBe('true');
  });

  it('should set number to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = 88;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.getAttribute('myprop')).toBe('88');
  });

  it('should set string to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = 'stringval';

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.getAttribute('myprop')).toBe('stringval');
  });

  var elm: any;
  beforeEach(() => {
    elm = mockElement('my-tag');
  });

});



describe('setAccessor for inputs', () => {
  const plt: any = mockPlatform();

  describe('simple attributes', () => {
    describe('should not add attribute when prop is undefined or null', () => {
      function testStraightForwardAttribute(propName: string, newValue: any, oldValue: any) {
        let inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false);

        expect(inputElm.hasAttribute(propName)).toBe(false);
      }

      it(`aria-disabled`, () => {
        testStraightForwardAttribute('aria-disabled', undefined, undefined);
        testStraightForwardAttribute('aria-disabled', null, undefined);
      });
      it(`autoCapitalize`, () => {
        testStraightForwardAttribute('autoCapitalize', undefined, undefined);
        testStraightForwardAttribute('autoCapitalize', null, undefined);
      });
      it(`autoComplete`, () => {
        testStraightForwardAttribute('autoComplete', undefined, undefined);
        testStraightForwardAttribute('autoComplete', null, undefined);
      });
      it(`autoCorrect`, () => {
        testStraightForwardAttribute('autoCorrect', undefined, undefined);
        testStraightForwardAttribute('autoCorrect', null, undefined);
      });
      it(`autoFocus`, () => {
        testStraightForwardAttribute('autoFocus', undefined, undefined);
        testStraightForwardAttribute('autoFocus', null, undefined);
      });
      it(`inputMode`, () => {
        testStraightForwardAttribute('inputMode', undefined, undefined);
        testStraightForwardAttribute('inputMode', null, undefined);
      });
      it(`results`, () => {
        testStraightForwardAttribute('results', undefined, undefined);
        testStraightForwardAttribute('results', null, undefined);
      });
      it(`spellCheck`, () => {
        testStraightForwardAttribute('spellCheck', undefined, undefined);
        testStraightForwardAttribute('spellCheck', null, undefined);
      });
    });

    describe('should update when prop is defined', () => {
      function testStraightForwardAttribute(propName: string, newValue: any, oldValue: any) {
        let inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false);

        expect(inputElm.hasAttribute(propName)).toBe(true);
        expect(inputElm.getAttribute(propName)).toBe(newValue.toString());
      }

      it(`aria-disabled should be added when set to true`, () => {
        testStraightForwardAttribute('aria-disabled', true, undefined);
      });
      it(`autoCapitalize should be added when set to 'sentences'`, () => {
        testStraightForwardAttribute('autoCapitalize', 'sentences', undefined);
      });
      it(`autoComplete should be added when set to true`, () => {
        testStraightForwardAttribute('autoComplete', true, undefined);
      });
      it(`autoCorrect should be added when set to true`, () => {
        testStraightForwardAttribute('autoCorrect', true, undefined);
      });
      it(`autoFocus should be added when set to true`, () => {
        testStraightForwardAttribute('autoFocus', true, undefined);
      });
      it(`inputMode should be added when set to 'numeric'`, () => {
        testStraightForwardAttribute('inputMode', 'numeric', undefined);
      });
      it(`results should be added when set to 'blah'`, () => {
        testStraightForwardAttribute('results', 'blah', undefined);
      });
      it(`spellCheck should be added when set to true`, () => {
        testStraightForwardAttribute('spellCheck', true, undefined);
      });
    });
  });


  describe('special attributes', () => {
    describe('should not add attribute when prop is undefined or null', () => {
      function testSpecialAttribute(propName: string, newValue: any, oldValue: any) {
        let inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false);

        expect(inputElm.hasAttribute(propName)).toBe(false);
      }
      it(`accept`, () => {
        testSpecialAttribute('accept', undefined, undefined);
        testSpecialAttribute('accept', null, undefined);
      });
      it(`minLength`, () => {
        testSpecialAttribute('minLength', undefined, undefined);
        testSpecialAttribute('minLength', null, undefined);
      });
      it(`maxLength`, () => {
        testSpecialAttribute('maxLength', undefined, undefined);
        testSpecialAttribute('maxLength', null, undefined);
      });
      it(`name`, () => {
        testSpecialAttribute('name', undefined, undefined);
        testSpecialAttribute('name', null, undefined);
      });
      it(`pattern`, () => {
        testSpecialAttribute('pattern', undefined, undefined);
        testSpecialAttribute('pattern', null, undefined);
      });
      it(`placeholder`, () => {
        testSpecialAttribute('placeholder', undefined, undefined);
        testSpecialAttribute('placeholder', null, undefined);
      });
      it(`step`, () => {
        testSpecialAttribute('step', undefined, undefined);
        testSpecialAttribute('step', null, undefined);
      });
      it(`size`, () => {
        testSpecialAttribute('size', undefined, undefined);
        testSpecialAttribute('size', null, undefined);
      });
      it(`type`, () => {
        testSpecialAttribute('type', undefined, undefined);
        testSpecialAttribute('type', null, undefined);
      });
    });

    describe('should update when prop is defined', () => {
      function testSpecialAttribute(propName: string, newValue: any, oldValue: any) {
        let inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false);

        expect(inputElm.hasAttribute(propName)).toBe(true);
        expect(inputElm.getAttribute(propName)).toBe(newValue.toString());
        expect((inputElm as any)[propName]).toBe(newValue);
      }

      it(`accept should be added when set to 'text/html'`, () => {
        testSpecialAttribute('accept', 'text/html', undefined);
      });
      it(`minLength should be added when set to 10`, () => {
        testSpecialAttribute('minLength', 10, undefined);
      });
      it(`maxLength should be added when set to 100`, () => {
        testSpecialAttribute('maxLength', 100, undefined);
      });
      it(`name should be added when set to 'test'`, () => {
        testSpecialAttribute('name', 'test', undefined);
      });
      it(`pattern should be added when set to '[a-zA-Z0-9]+'`, () => {
        testSpecialAttribute('pattern', '[a-zA-Z0-9]+', undefined);
      });
      it(`placeholder should be added when set to 'text placeholder'`, () => {
        testSpecialAttribute('placeholder', 'text placeholder', undefined);
      });
      it(`step should be added when set to 'any'`, () => {
        testSpecialAttribute('step', 'any', undefined);
      });
      it(`size should be added when set to 40`, () => {
        testSpecialAttribute('size', 40, undefined);
      });
      it(`type should be added when set to 'tel'`, () => {
        testSpecialAttribute('type', 'tel', undefined);
      });
    });
  });

  describe('boolean attributes', () => {
    describe('should not add attribute when prop is undefined or null', () => {
      function testBooleanAttribute(propName: string, newValue: any, oldValue: any) {
        let inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false);

        expect(inputElm.hasAttribute(propName)).toBe(false);
      }

      it(`disabled`, () => {
        testBooleanAttribute('disabled', undefined, undefined);
        testBooleanAttribute('disabled', null, undefined);
      });
      it(`multiple`, () => {
        testBooleanAttribute('multiple', undefined, undefined);
        testBooleanAttribute('multiple', null, undefined);
      });
      it(`required`, () => {
        testBooleanAttribute('required', undefined, undefined);
        testBooleanAttribute('required', null, undefined);
      });
      it(`readOnly`, () => {
        testBooleanAttribute('readOnly', undefined, undefined);
        testBooleanAttribute('readOnly', null, undefined);
      });
    });
    describe('should update when prop is defined', () => {
      function testBooleanAttribute(propName: string, newValue: any, oldValue: any) {
        let inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false);

        expect(inputElm.hasAttribute(propName)).toBe(true);
        expect(inputElm.getAttribute(propName)).toBe('');
        expect((inputElm as any)[propName]).toBe(newValue);
      }

      it(`disabled should be added when set to true`, () => {
        testBooleanAttribute('disabled', true, undefined);
      });
      it(`multiple should be added when set to true`, () => {
        testBooleanAttribute('multiple', true, undefined);
      });
      it(`required should be added when set to true`, () => {
        testBooleanAttribute('required', true, undefined);
      });
      it(`readOnly should be added when set to true`, () => {
        testBooleanAttribute('readOnly', true, undefined);
      });
    });
  });

  describe('min/max attributes', () => {
    describe('should not add attribute when prop is undefined or null', () => {
      function testMinMaxAttribute(propName: string, newValue: any, oldValue: any) {
        let inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false);

        expect(inputElm.hasAttribute(propName)).toBe(false);
      }

      it(`min`, () => {
        testMinMaxAttribute('min', undefined, undefined);
        testMinMaxAttribute('min', null, undefined);
      });
      it(`max`, () => {
        testMinMaxAttribute('max', undefined, undefined);
        testMinMaxAttribute('max', null, undefined);
      });
    });
    describe('should update when prop is defined', () => {
      function testMinMaxAttribute(propName: string, newValue: any, oldValue: any) {
        let inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false);

        expect(inputElm.hasAttribute(propName)).toBe(true);
        expect(inputElm.getAttribute(propName)).toBe(newValue.toString());
        expect((inputElm as any)[propName]).toBe(newValue.toString());
      }

      it(`min should be added when set to 20`, () => {
        testMinMaxAttribute('min', 20, undefined);
      });
      it(`max should be added when set to 40`, () => {
        testMinMaxAttribute('max', 40, undefined);
      });
    });
  });

});
