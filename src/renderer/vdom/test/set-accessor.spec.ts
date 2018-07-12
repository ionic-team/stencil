import * as d from '../../../declarations';
import { mockElement, mockPlatform } from '../../../testing/mocks';
import { PROP_TYPE } from '../../../util/constants';
import { setAccessor } from '../set-accessor';


describe('setAccessor for custom elements', () => {

  var elm: any;
  let plt: d.PlatformApi;

  beforeEach(() => {
    plt = mockPlatform();
    elm = mockElement('my-tag');
  });


  describe('event listener', () => {

    it('should allow public method starting with "on" and capital 3rd character', () => {
      const addEventSpy = spyOn(elm, 'addEventListener');
      const removeEventSpy = spyOn(elm, 'removeEventListener');

      elm.onMyMethod = () => {/**/};

      const fn = () => {/**/};
      setAccessor(plt, elm, 'onMyMethod', undefined, fn, false, false);

      expect(addEventSpy).toHaveBeenCalledTimes(0);
    });

    it('should remove standardized event listener when has old value, but no new', () => {
      const addEventSpy = spyOn(elm, 'addEventListener');
      const removeEventSpy = spyOn(elm, 'removeEventListener');

      const orgValue = () => {/**/};
      setAccessor(plt, elm, 'onClick', undefined, orgValue, false, false);

      const newValue = undefined;
      setAccessor(plt, elm, 'onClick', orgValue, undefined, false, false);

      expect(addEventSpy).toHaveBeenCalledTimes(1);
      expect(removeEventSpy).toHaveBeenCalledWith('click', orgValue, false);
    });

    it('should remove standardized multiple-word then add event listener w/ different value', () => {
      const addEventSpy = spyOn(elm, 'addEventListener');
      const removeEventSpy = spyOn(elm, 'removeEventListener');

      const orgValue = () => {/**/};
      setAccessor(plt, elm, 'onMouseOver', undefined, orgValue, false, false);

      const newValue = () => {/**/};
      setAccessor(plt, elm, 'onMouseOver', orgValue, undefined, false, false);

      expect(addEventSpy).toHaveBeenCalledWith('mouseover', orgValue, false);
      expect(removeEventSpy).toHaveBeenCalledWith('mouseover', orgValue, false);
    });

    it('should remove standardized then add event listener w/ different value', () => {
      const addEventSpy = spyOn(elm, 'addEventListener');
      const removeEventSpy = spyOn(elm, 'removeEventListener');

      const orgValue = () => {/**/};
      setAccessor(plt, elm, 'onClick', undefined, orgValue, false, false);

      const newValue = () => {/**/};
      setAccessor(plt, elm, 'onClick', orgValue, newValue, false, false);

      expect(addEventSpy).toHaveBeenCalledTimes(2);
      expect(removeEventSpy).toHaveBeenCalledWith('click', orgValue, false);
    });

    it('should add custom event listener when no old value', () => {
      const addEventSpy = spyOn(elm, 'addEventListener');
      const removeEventSpy = spyOn(elm, 'removeEventListener');

      const oldValue = undefined;
      const newValue = () => {/**/};

      setAccessor(plt, elm, 'onIonChange', oldValue, newValue, false, false);

      expect(addEventSpy).toHaveBeenCalledWith('ionChange', newValue, false);
      expect(removeEventSpy).not.toHaveBeenCalled();
    });

    it('should add standardized multiple-word event listener when no old value', () => {
      const addEventSpy = spyOn(elm, 'addEventListener');
      const removeEventSpy = spyOn(elm, 'removeEventListener');

      const oldValue = undefined;
      const newValue = () => {/**/};

      setAccessor(plt, elm, 'onMouseOver', oldValue, newValue, false, false);

      expect(addEventSpy).toHaveBeenCalledWith('mouseover', newValue, false);
      expect(removeEventSpy).not.toHaveBeenCalled();
    });

    it('should add standardized event listener when no old value', () => {
      const addEventSpy = spyOn(elm, 'addEventListener');
      const removeEventSpy = spyOn(elm, 'removeEventListener');

      const oldValue = undefined;
      const newValue = () => {/**/};

      setAccessor(plt, elm, 'onClick', oldValue, newValue, false, false);

      expect(addEventSpy).toHaveBeenCalledWith('click', newValue, false);
      expect(removeEventSpy).not.toHaveBeenCalled();
    });

  });

  it('should set undefined property to child with existing property', () => {
    const oldValue: any = 'someval';
    const newValue: any = undefined;

    Object.defineProperty(elm, 'myprop', {
      set: () => {/**/},
      get: () => 'getterValue'
    });

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBe('getterValue');
    expect(elm.hasAttribute('myprop')).toBe(false);

    const propDesc = Object.getOwnPropertyDescriptor(elm, 'myprop');
    expect(propDesc).toBeDefined();
  });

  it('should set object property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = { some: 'obj' };

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set array property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = [1, 2, 3];

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should not set ref as a property', () => {
    const oldValue: any = 'someval';
    const newValue: any = function meFun() {/**/};

    setAccessor(plt, elm, 'ref', oldValue, newValue, false, false);
    expect(elm.ref).toBeUndefined();
    expect(elm.hasAttribute('ref')).toBe(false);
  });

  it('should set function property to child', () => {
    const oldValue: any = 'someval';
    const newValue: any = function meFun() {/**/};

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBe(newValue);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set null property to child and it is a child prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = null;
    elm.myprop = oldValue;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set string property to child when child already has that property', () => {
    const oldValue: any = 'someval';
    const newValue: any = 'stringval';
    elm.myprop = oldValue;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBe('stringval');
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should set null property to child when known child component should have that property', () => {
    const childCmpMeta: d.ComponentMeta = {
      tagNameMeta: 'cmp-a',
      membersMeta: {
        cmpAprop: {
          propType: PROP_TYPE.String
        }
      }
    };
    const plt: any = {
      getComponentMeta: function() {
        return childCmpMeta;
      }
    };
    elm = mockElement('cmp-a');

    const oldValue: any = 'someval';
    const newValue: any = null;
    elm.cmpAprop = oldValue;

    setAccessor(plt, elm, 'cmpAprop', oldValue, newValue, false, false);
    expect(elm.cmpAprop).toBe(null);
    expect(elm.hasAttribute('cmpAprop')).toBe(false);
  });

  it('should do nothing when setting null prop but child doesnt have that prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = null;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.hasAttribute('myprop')).toBe(false);
  });

  it('should do nothing when setting undefined prop but child doesnt have that prop', () => {
    const oldValue: any = 'someval';
    const newValue: any = undefined;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm.hasAttribute('myprop')).toBe(false);

    const propDesc = Object.getOwnPropertyDescriptor(elm, 'myprop');
    expect(propDesc).toBeUndefined();
  });

  it('should set false boolean to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = false;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBeUndefined();

    expect(elm).toMatchAttributes({ 'myprop': 'false' });
  });

  it('should add aria role attribute', () => {
    setAccessor(plt, elm, 'role', undefined, 'tab', true, false);
    expect(elm.hasAttribute('role')).toBe(true);
    expect(elm.getAttribute('role')).toBe('tab');
  });

  it('should update aria role attribute', () => {
    elm.setAttribute('role', 'tab');

    setAccessor(plt, elm, 'role', 'tab', 'other', true, false);
    expect(elm.getAttribute('role')).toBe('other');
  });

  it('should remove aria role attribute', () => {
    elm.setAttribute('role', 'tab');

    setAccessor(plt, elm, 'role', 'tab', undefined, true, false);
    expect(elm.hasAttribute('role')).toBe(false);
  });


  it('should update svg attribute', () => {
    elm.setAttribute('transform', 'rotate(45 72 72)');
    const oldValue: any = 'rotate(45 72 72)';
    const newValue: any = 'rotate(45 27 27)';

    setAccessor(plt, elm, 'transform', oldValue, newValue, true, false);
    expect(elm.transform).toBeUndefined();
    expect(elm.getAttribute('transform')).toBe('rotate(45 27 27)');
  });

  it('should add svg attribute', () => {
    const oldValue: any = undefined;
    const newValue: any = 'rotate(45 27 27)';

    setAccessor(plt, elm, 'transform', oldValue, newValue, true, false);
    expect(elm.transform).toBeUndefined();
    expect(elm.hasAttribute('transform')).toBe(true);
  });

  it('should remove svg attribute', () => {
    elm.setAttribute('transform', 'rotate(45 27 27)');
    const oldValue: any = 'rotate(45 27 27)';
    const newValue: any = undefined;

    setAccessor(plt, elm, 'transform', oldValue, newValue, true, false);
    expect(elm.transform).toBeUndefined();
    expect(elm.hasAttribute('transform')).toBe(false);
  });

  it('should set true boolean to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = true;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm).toMatchAttributes({ 'myprop': 'true' });
  });

  it('should set number to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = 88;

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm).toMatchAttributes({ 'myprop': '88' });
  });

  it('should set string to attribute', () => {
    const oldValue: any = 'someval';
    const newValue: any = 'stringval';

    setAccessor(plt, elm, 'myprop', oldValue, newValue, false, false);
    expect(elm.myprop).toBeUndefined();
    expect(elm).toMatchAttributes({ 'myprop': 'stringval' });
  });

});

describe('setAccessor for inputs', () => {
  const plt: any = mockPlatform();

  describe('simple attributes', () => {

    describe('should not add attribute when prop is undefined or null', () => {
      function testStraightForwardAttribute(propName: string, newValue: any, oldValue: any) {
        const inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false, false);

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
        const inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false, false);

        expect(inputElm).toMatchAttributes({ [propName]: newValue.toString() });
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
        const inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false, false);

        expect(inputElm).toMatchAttributes({ });
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
        const inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false, false);

        expect(inputElm).toMatchAttributes({ [propName]: newValue.toString() });
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
        const inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false, false);

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
        const inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false, false);

        expect(inputElm).toMatchAttributes({ [propName]: '' });
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
        const inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false, false);

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
        const inputElm = mockElement('input');
        setAccessor(plt, inputElm, propName, oldValue, newValue, false, false);

        expect(inputElm).toMatchAttributes({ [propName]: newValue.toString() });
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

describe('setAccessor for standard html elements', () => {
  const plt: any = mockPlatform();

  describe('simple global attributes', () => {

    it('should not add attribute when prop is undefined or null', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'title', undefined, undefined, false, false);

      expect(inputElm.hasAttribute('title')).toBe(false);
    });

    it('should add attribute when prop is string', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'title', undefined, 'lime', false, false);

      expect(inputElm.hasAttribute('title')).toBe(true);
    });

    it('should add attribute when prop is boolean', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'color', undefined, true, false, false);

      expect(inputElm.hasAttribute('color')).toBe(true);
    });

    it('should add attribute when prop is number', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'color', undefined, 1, false, false);

      expect(inputElm.hasAttribute('color')).toBe(true);
    });

    it('should remove attribute when prop is undefined', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'title', undefined, 'lime', false, false);
      setAccessor(plt, inputElm, 'title', 'lime', undefined, false, false);

      expect(inputElm.hasAttribute('title')).toBe(false);
    });

    it('should remove attribute when prop is null', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'title', undefined, 'lime', false, false);
      setAccessor(plt, inputElm, 'title', 'lime', null, false, false);

      expect(inputElm.hasAttribute('title')).toBe(false);
    });
  });

  describe('simple nonstandard attributes', () => {

    it('should not add attribute when prop is undefined or null', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'color', undefined, undefined, false, false);

      expect(inputElm.hasAttribute('color')).toBe(false);
    });

    it('should add attribute when prop is string', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'color', undefined, 'lime', false, false);

      expect(inputElm.hasAttribute('color')).toBe(true);
    });

    it('should add attribute when prop is boolean', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'color', undefined, true, false, false);

      expect(inputElm.hasAttribute('color')).toBe(true);
    });

    it('should add attribute when prop is number', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'color', undefined, 1, false, false);

      expect(inputElm.hasAttribute('color')).toBe(true);
    });

    it('should aria role attribute', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'role', undefined, 'main', false, false);

      expect(inputElm.hasAttribute('role')).toBe(true);
    });

    it('should remove attribute when prop is undefined', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'color', undefined, 1, false, false);
      setAccessor(plt, inputElm, 'color', 1, undefined, false, false);

      expect(inputElm.hasAttribute('color')).toBe(false);
    });

    it('should remove attribute when prop is null', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'color', undefined, 1, false, false);
      setAccessor(plt, inputElm, 'color', 1, null, false, false);

      expect(inputElm.hasAttribute('color')).toBe(false);
    });
    it('should remove aria role attribute', () => {
      const inputElm = mockElement('section');
      setAccessor(plt, inputElm, 'role', undefined, 'main', false, false);
      setAccessor(plt, inputElm, 'role', 'main', undefined, false, false);

      expect(inputElm.hasAttribute('role')).toBe(false);
    });
  });

  describe('class attribute', () => {
    it('should add classes', () => {
      const elm = mockElement('section');
      setAccessor(plt, elm, 'class', undefined, 'class1 class2   class3', false, false);
      expect(elm).toMatchClasses(['class1', 'class2', 'class3']);

      setAccessor(plt, elm, 'class', undefined, 'new', false, false);
      expect(elm).toMatchClasses(['class1', 'class2', 'class3', 'new']);

      setAccessor(plt, elm, 'class',
        'class1 class2',
        'new class4', false, false);
      expect(elm).toMatchClasses(['class3', 'new', 'class4']);
    });

    it('should not add any classes', () => {
      const elm = mockElement('section');
      setAccessor(plt, elm, 'class', '', '', false, false);
      expect(elm).toMatchClasses([]);

      setAccessor(plt, elm, 'class', 'class1 class3 class2', 'class1 class2 class3', false, false);
      expect(elm).toMatchClasses([]);

      setAccessor(plt, elm, 'class', 'class1 class3 class2', undefined, false, false);
      expect(elm).toMatchClasses([]);

      setAccessor(plt, elm, 'class', undefined, undefined, false, false);
      expect(elm).toMatchClasses([]);
    });

    it('should remove classes', () => {
      const elm = mockElement('section');
      elm.classList.add('icon', 'ion-color');

      setAccessor(plt, elm, 'class', 'icon', 'icon2', false, false);
      expect(elm).toMatchClasses(['ion-color', 'icon2']);
    });

    it('should not have duplicated classes', () => {
      const elm = mockElement('section');
      elm.classList.add('md');

      setAccessor(plt, elm, 'class', undefined, 'md ios', false, false);
      expect(elm.className).toEqual('md ios');
    });

    it('should also add one class', () => {
      const elm = mockElement('section');
      elm.classList.add('md');

      setAccessor(plt, elm, 'class', 'md', 'md ios', false, false);
      expect(elm.className).toEqual('md ios');
    });

    it('should remove one class', () => {
      const elm = mockElement('section');
      elm.classList.add('md');

      setAccessor(plt, elm, 'class', 'md', '', false, false);
      expect(elm.className).toEqual('');
    });
  });


  describe('style attribute', () => {

    it('should add styles', () => {
      let elm = mockElement('section');
      const newStyles = {
        'box-shadow': '1px',
        'color': 'blue',
        paddingLeft: '88px'
      };
      setAccessor(plt, elm, 'style', undefined, newStyles, false, false);
      expect(elm.style.cssText).toEqual('box-shadow: 1px; color: blue; padding-left: 88px;');

      elm = mockElement('my-tag');
      setAccessor(plt, elm, 'style', {}, {
        'font-size': '12px',
        marginRight: '55px'
      }, false, false);
      expect(elm.style.cssText).toEqual('font-size: 12px; margin-right: 55px;');

      elm = mockElement('my-tag');
      setAccessor(plt, elm, 'style', {
        'font-size': '12px',
        'color': 'blue'
      }, {
        'font-size': '20px'
        }, false, false);

      expect(elm.style.cssText).toEqual('font-size: 20px;');
    });

    it('should not add styles', () => {
      const elm = mockElement('section');
      setAccessor(plt, elm, 'style', undefined, undefined, false, false);
      expect(elm.style.cssText).toEqual('');

      setAccessor(plt, elm, 'style',
        { color: 'blue', 'font-size': '12px', paddingLeft: '88px' },
        { color: 'blue', 'font-size': '12px', paddingLeft: '88px' }, false, false);
      expect(elm.style.cssText).toEqual('');

      setAccessor(plt, elm, 'style', { color: 'blue', 'font-size': '12px' },
        undefined, false, false);
      expect(elm.style.cssText).toEqual('');
    });

    it('should change styles only when it has a new value', () => {
      const elm = mockElement('section');
      elm.style.setProperty('color', 'black');
      elm.style.setProperty('padding', '20px');

      setAccessor(plt, elm, 'style',
        { color: 'blue', 'padding': '20px', marginRight: '88px' },
        { color: 'blue', 'padding': '30px', marginRight: '55px' }, false, false);

      expect(elm.style.cssText).toEqual('color: black; padding: 30px; margin-right: 55px;');
    });

    it('should remove styles', () => {
      const elm = mockElement('section');
      elm.style.setProperty('color', 'black');
      elm.style.setProperty('padding', '20px');
      elm.style.setProperty('margin', '20px');
      elm.style.setProperty('font-size', '88px');

      expect(elm.style.cssText).toEqual('color: black; padding: 20px; margin: 20px; font-size: 88px;');

      setAccessor(plt, elm, 'style', { color: 'black', padding: '20px', fontSize: '88px' }, undefined, false, false);
      expect(elm.style.cssText).toEqual('margin: 20px;');

      setAccessor(plt, elm, 'style', { margin: '20px' }, { margin: '30px', color: 'orange' }, false, false);
      expect(elm.style.cssText).toEqual('margin: 30px; color: orange;');
    });

  });

});
