import { formatComponentMeta } from '../data-serialize';
import { parseComponentMeta, parsePropertyValue } from '../data-parse';
import { ComponentMeta, ComponentRegistry, FormatComponentDataOptions } from '../interfaces';
import { ATTR_DASH_CASE, ATTR_LOWER_CASE, BUNDLE_ID, STYLES, HAS_SLOTS, TYPE_BOOLEAN, TYPE_NUMBER } from '../constants';


describe('data serialize/parse', () => {

  it('should set shadow dom', () => {
    cmpMeta.isShadowMeta = true;

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].isShadowMeta).toBe(true);
  });

  it('should set no shadow dom', () => {
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].isShadowMeta).toBeFalsy();
  });

  it('should set has slot', () => {
    cmpMeta.slotMeta = HAS_SLOTS;

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].slotMeta).toBe(HAS_SLOTS);
  });

  it('should set no slot', () => {
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].slotMeta).toBeFalsy();
  });

  it('should set hostMeta', () => {
    cmpMeta.hostMeta = {
      class: {
        'class-name': true
      }
    };

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].hostMeta.class['class-name']).toBe(true);
  });

  it('should set no hostMeta', () => {
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].hostMeta).toBeFalsy();
  });

  it('should set watchersMeta', () => {
    cmpMeta.watchersMeta = [
      {
        fn: 'method1',
        propName: 'prop'
      }
    ];

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].watchersMeta[0].fn).toBe('method1');
    expect(registry['TAG'].watchersMeta[0].propName).toBe('prop');
  });

  it('should set no watchersMeta', () => {
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].watchersMeta).toBeFalsy();
  });

  it('should set listenersMeta', () => {
    cmpMeta.listenersMeta = [
      {
        eventName: 'click',
        eventMethod: 'method1',
        eventCapture: true,
        eventPassive: true,
        eventEnabled: false
      }
    ];

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].listenersMeta[0].eventName).toBe('click');
    expect(registry['TAG'].listenersMeta[0].eventMethod).toBe('method1');
    expect(registry['TAG'].listenersMeta[0].eventCapture).toBe(true);
    expect(registry['TAG'].listenersMeta[0].eventEnabled).toBe(false);
    expect(registry['TAG'].listenersMeta[0].eventPassive).toBe(true);
  });

  it('should set no listenersMeta', () => {
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].listenersMeta).toBeFalsy();
  });

  it('should set statesMeta', () => {
    cmpMeta.statesMeta = ['method1', 'method2'];

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].statesMeta[0]).toEqual('method1');
    expect(registry['TAG'].statesMeta[1]).toEqual('method2');
  });

  it('should set no statesMeta', () => {
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].statesMeta).toBeFalsy();
  });

  it('should set methodsMeta', () => {
    cmpMeta.methodsMeta = ['method1', 'method2'];

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].methodsMeta[0]).toEqual('method1');
    expect(registry['TAG'].methodsMeta[1]).toEqual('method2');
  });

  it('should set no methodsMeta', () => {
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].methodsMeta).toBeFalsy();
  });

  it('should set attribute lower case from config', () => {
    cmpMeta.propsMeta = [
      { propName: 'propName1' },
      { propName: 'propName2', attribCase: ATTR_DASH_CASE }
    ];

    opts.defaultAttrCase = ATTR_LOWER_CASE;
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].propsMeta[2].attribName).toEqual('propname1');
    expect(registry['TAG'].propsMeta[3].attribName).toEqual('prop-name2');
  });

  it('should set attribute dash case', () => {
    cmpMeta.propsMeta = [
      { propName: 'propName1' },
      { propName: 'propName2', attribCase: ATTR_LOWER_CASE }
    ];

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].propsMeta[2].attribName).toEqual('prop-name1');
    expect(registry['TAG'].propsMeta[3].attribName).toEqual('propname2');
  });

  it('should set number prop', () => {
    cmpMeta.propsMeta = [
      { propName: 'num', propType: TYPE_NUMBER },
      { propName: 'str' },
    ];

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].propsMeta[2].propName).toEqual('num');
    expect(registry['TAG'].propsMeta[2].propType).toEqual(TYPE_NUMBER);

    expect(registry['TAG'].propsMeta[3].propName).toEqual('str');
    expect(registry['TAG'].propsMeta[3].propType).toBeUndefined();
  });

  it('should set boolean prop', () => {
    cmpMeta.propsMeta = [
      { propName: 'boo', propType: TYPE_BOOLEAN }
    ];

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].propsMeta[2].propName).toEqual('boo');
    expect(registry['TAG'].propsMeta[2].propType).toEqual(TYPE_BOOLEAN);
  });

  it('should always set color/mode even with no props', () => {
    cmpMeta.propsMeta = null;

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].propsMeta.length).toEqual(2);
    expect(registry['TAG'].propsMeta[0].propName).toEqual('color');
    expect(registry['TAG'].propsMeta[0].attribName).toEqual('color');
    expect(registry['TAG'].propsMeta[1].propName).toEqual('mode');
  });

  it('should only set one of the modes', () => {
    cmpMeta.modesMeta = {
      ios: [`abc`],
      md: [`def`]
    };

    opts.onlyIncludeModeName = 'md';

    let format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));
    expect(registry['TAG'].modesMeta.ios).toBeUndefined();
    expect(registry['TAG'].modesMeta.md[BUNDLE_ID]).toBe('def');
    expect(registry['TAG'].modesMeta.md[STYLES]).toBeFalsy();
  });

  it('should set all of the modes', () => {
    cmpMeta.modesMeta = {
      ios: [`abc`],
      md: [`def`]
    };

    let format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));
    expect(registry['TAG'].modesMeta.ios[BUNDLE_ID]).toBe('abc');
    expect(registry['TAG'].modesMeta.ios[STYLES]).toBeFalsy();
    expect(registry['TAG'].modesMeta.md[BUNDLE_ID]).toBe('def');
    expect(registry['TAG'].modesMeta.md[STYLES]).toBeFalsy();
  });

  it('should set mode data without overwriting existing data', () => {
    cmpMeta.modesMeta = {
      ios: [`abc`]
    };

    let format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));
    expect(registry['TAG'].modesMeta.ios[BUNDLE_ID]).toBe('abc');
    expect(registry['TAG'].modesMeta.ios[STYLES]).toBeFalsy();

    cmpMeta = {
      tagNameMeta: 'tag',
      modesMeta: { ios: [`abc`, `body{}`] }
    };

    format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));
    expect(registry['TAG'].modesMeta.ios[BUNDLE_ID]).toBe('abc');
    expect(registry['TAG'].modesMeta.ios[STYLES].trim()).toBe('body{}');
  });

  it('should set mode styles', () => {
    cmpMeta.modesMeta = {
      ios: [`abc`, `body{}`]
    };

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].modesMeta.ios[STYLES].trim()).toEqual('body{}');
  });

  it('should set mode bundleId', () => {
    cmpMeta.modesMeta = {
      ios: [`abc`]
    };

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].modesMeta.ios[BUNDLE_ID]).toEqual('abc');
  });

  it('should set componentModuleMeta', () => {
    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['TAG'].componentModuleMeta).toEqual(moduleImports.TAG);
  });

  it('should set tagName', () => {
    cmpMeta = { tagNameMeta: 'ion-tag-name' };

    const format = formatComponentMeta(cmpMeta, opts);
    parseComponentMeta(registry, moduleImports, evalStr(format));

    expect(registry['ION-TAG-NAME'].tagNameMeta).toEqual('ion-tag-name');
  });


  describe('parsePropertyValue', () => {

    describe('number', () => {

      it('should convert number 1 to number 1', () => {
        expect(parsePropertyValue(TYPE_NUMBER, 1)).toBe(1);
      });

      it('should convert number 0 to number 0', () => {
        expect(parsePropertyValue(TYPE_NUMBER, 0)).toBe(0);
      });

      it('should convert string "0" to number 0', () => {
        expect(parsePropertyValue(TYPE_NUMBER, '0')).toBe(0);
      });

      it('should convert string "88" to number 88', () => {
        expect(parsePropertyValue(TYPE_NUMBER, '88')).toBe(88);
      });

      it('should convert empty string "" to NaN', () => {
        expect(parsePropertyValue(TYPE_NUMBER, '')).toEqual(NaN);
      });

      it('should convert any string "anyword" to NaN', () => {
        expect(parsePropertyValue(TYPE_NUMBER, 'anyword')).toEqual(NaN);
      });

      it('should keep number undefined as undefined', () => {
        expect(parsePropertyValue(TYPE_NUMBER, undefined)).toEqual(undefined);
      });

      it('should keep number null as null', () => {
        expect(parsePropertyValue(TYPE_NUMBER, null)).toBe(null);
      });

    });

    describe('boolean', () => {

      it('should set boolean 1 as true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 1)).toBe(true);
      });

      it('should set boolean 0 as false', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 0)).toBe(false);
      });

      it('should keep boolean true as boolean true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, true)).toBe(true);
      });

      it('should keep boolean false as boolean false', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, false)).toBe(false);
      });

      it('should convert string "false" to boolean false', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 'false')).toBe(false);
      });

      it('should convert string "true" to boolean true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 'true')).toBe(true);
      });

      it('should convert empty string "" to boolean true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, '')).toBe(true);
      });

      it('should convert any string "anyword" to boolean true', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, 'anyword')).toBe(true);
      });

      it('should keep boolean undefined as undefined', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, undefined)).toBe(undefined);
      });

      it('should keep boolean null as null', () => {
        expect(parsePropertyValue(TYPE_BOOLEAN, null)).toBe(null);
      });

    });

  });


  var registry: ComponentRegistry = {};
  var moduleImports: any = { 'TAG': class MyTag {} };
  var cmpMeta: ComponentMeta = {};
  var opts: FormatComponentDataOptions = {};

  beforeEach(() => {
    registry = {};
    cmpMeta = { tagNameMeta: 'tag' };
    opts = { defaultAttrCase: ATTR_DASH_CASE, includeStyles: true };
  });

});


function evalStr(str: string): any {
  return new Function(`return ${str.replace(/\n/gm, '')};`)();
}
