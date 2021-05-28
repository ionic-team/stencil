import { transpileModule, getStaticGetter } from './transpile';

describe('parse mixins', () => {
  it('mixes in from another component class', () => {
    const t = transpileModule([{
      fileName: 'mixin.tsx',
      code: `
        @Component({
          tag: 'cmp-a',
          scoped: true
        })
        export class CmpA {
          @Prop() mixinProp?: string;
          @State() mixinState?: string;
          @Method() mixinMethod() {}
          @Listen('mixinListen') mixinListen() {}
          @Event() mixinEvent: EventEmitter<void>;
          static get mixinLocalProp() {
            return 'mixinLocalProp';
          }
          privateMixinMethod() {}
        }
      `
    }, {
      fileName: 'component.tsx',
      code: `
        import { CmpA } from 'mixin';
        @Mixin(CmpA)
        @Component({
          tag: 'cmp-b',
          shadow: true
        })
        export class CmpB {
          @Prop() hostProp?: string;
          @State() hostState?: string;
          @Method() hostMethod() {}
          @Listen('hostListen') hostListen() {}
          @Event() hostEvent: EventEmitter<void>;
          static get hostLocalProp() {
            return 'hostLocalProp';
          }
          privateHostMethod() {}
        }
      `
    }]);

    expect(t.componentClassName).toBe('CmpB');
    expect(t.tagName).toBe('cmp-b');
    expect(getStaticGetter(t.outputText, 'encapsulation')).toEqual('shadow');

    expect(t.properties[0].name).toBe('hostProp');
    expect(t.properties[1].name).toBe('mixinProp');

    expect(t.states[0].name).toBe('hostState');
    expect(t.states[1].name).toBe('mixinState');

    expect(t.methods[0].name).toBe('hostMethod');
    expect(t.methods[1].name).toBe('mixinMethod');

    expect(t.listeners[0].name).toBe('hostListen');
    expect(t.listeners[1].name).toBe('mixinListen');

    expect(t.events[0].name).toBe('hostEvent');
    expect(t.events[1].name).toBe('mixinEvent');

    expect(getStaticGetter(t.outputText, 'hostLocalProp')).toEqual('hostLocalProp');
    expect(getStaticGetter(t.outputText, 'mixinLocalProp')).toEqual('mixinLocalProp');
  });

  it('does not overwrite members on the host component from the mixin', () => {
    const t = transpileModule([{
      fileName: 'mixin.tsx',
      code: `
        export class CmpA {
          @Prop() hostProp: string = 'mixinProp';
          @Prop() controlProp: string = 'mixinProp';
          @Method() hostMethod() {
            return 'mixinMethod';
          }
          @Listen('mixinListen') hostListen() {}
          @Event() hostEvent: EventEmitter<'mixinEventReturn'>;
          static get hostLocalProp() {
            return 'mixinValue';
          }
        }
      `
    }, {
      fileName: 'component.tsx',
      code: `
        import { CmpA } from 'mixin';
        @Mixin(CmpA)
        @Component({
          tag: 'cmp-b',
          shadow: true
        })
        export class CmpB {
          @Prop() hostProp: string = 'hostProp';
          @Method() hostMethod() {
            return true;
          }
          @Listen('hostListen') hostListen() {}
          @Event() hostEvent: EventEmitter<'hostEventReturn'>;
          static get hostLocalProp() {
            return 'hostValue';
          }
        }
      `
    }]);

    expect(t.componentClassName).toBe('CmpB');

    expect(t.property.defaultValue).toBe("'hostProp'");
    expect(t.properties[1].name).toBe('controlProp');

    expect(t.method.complexType.return).toBe('boolean');
    expect(t.method.name).toBe('hostMethod');
    expect(t.methods[1]).toBe(undefined);

    expect(t.event.name).toBe('hostEvent');
    expect(t.event.complexType.resolved).toBe('\"hostEventReturn\"');
    expect(t.events[1]).toBe(undefined);

    expect(t.listeners[0].name).toBe('hostListen');
    expect(t.listeners[0].method).toBe('hostListen');
    expect(t.listeners[1]).toBe(undefined);

    expect(getStaticGetter(t.outputText, 'hostLocalProp')).toEqual('hostValue');
  });

  it('can resolve multiple default or named exports', () => {
    const t = transpileModule([{
      fileName: 'mixin1.tsx',
      code: `
        export class CmpA {
          @Prop() file1MixinPropA?: string;
        }
        export default class CmpB {
          @Prop() file1MixinPropDeafult?: string;
        }
        export default class CmpC {
          @Prop() willNotMixThisIn?: string;
        }
      `
    }, {
      fileName: 'mixin2.tsx',
      code: `
        export class CmpA {
          @Prop() file2MixinPropA?: string;
        }
        export default class CmpB {
          @Prop() file2MixinPropDeafult?: string;
        }
      `
    }, {
      fileName: 'component.tsx',
      code: `
        import DefaultComp1, { CmpA } from 'mixin1';
        import DefaultComp2, { CmpA as CmpAFile2 } from 'mixin2';
        @Mixin(CmpA)
        @Mixin(DefaultComp1)
        @Mixin(CmpAFile2)
        @Mixin(DefaultComp2)
        @Component({
          tag: 'cmp-host'
        })
        export class CmpHost {
          @Prop() hostProp?: string;
        }
      `
    }]);

    expect(t.componentClassName).toBe('CmpHost');
    expect(t.tagName).toBe('cmp-host');

    expect(t.properties[5]).toBe(undefined);
    expect(t.properties[4].name).toBe('file1MixinPropA');
    expect(t.properties[3].name).toBe('file1MixinPropDeafult');
    expect(t.properties[2].name).toBe('file2MixinPropA');
    expect(t.properties[1].name).toBe('file2MixinPropDeafult');
    expect(t.properties[0].name).toBe('hostProp');
  });

  it('merges and overwrites mixin members appropriately', () => {
    const t = transpileModule([{
      fileName: 'mixin1.tsx',
      code: `
        export class CmpA {
          @Prop() overridePropA: string = 'should-get-overridden-by-b';
          @Method() overrideMethodB() {
            return 'should-get-overridden-by-b';
          }
          @Prop() overridePropC: string = 'should-get-overridden-by-host1';
        }
        export class CmpB {
          @Prop() overridePropA: string = 'should-override-a';
          @Prop() overridePropC: string = 'should-get-overridden-by-host2';
        }
      `
    }, {
      fileName: 'mixin2.tsx',
      code: `
        export class CmpC {
          @Method() overrideMethodB() {
            return true;
          }
          @Prop() overridePropC: string = 'should-get-overridden-by-host3';
        }
      `
    }, {
      fileName: 'component.tsx',
      code: `
        import { CmpA, CmpB } from 'mixin1';
        import { CmpC } from 'mixin2';
        @Mixin(CmpA)
        @Mixin(CmpB)
        @Mixin(CmpC)
        @Component({
          tag: 'cmp-host'
        })
        export class CmpHost {
          @Prop() overridePropC?: string = 'should-override-c';
        }
      `
    }]);

    expect(t.componentClassName).toBe('CmpHost');
    expect(t.tagName).toBe('cmp-host');

    expect(t.properties[1].name).toBe('overridePropA');
    expect(t.properties[1].defaultValue).toBe("'should-override-a'");

    expect(t.method.name).toBe('overrideMethodB');
    expect(t.method.complexType.return).toBe('boolean');

    expect(t.properties[0].name).toBe('overridePropC');
    expect(t.properties[0].defaultValue).toBe("'should-override-c'");
  });

  it('does not include omitted class members', () => {
    const t = transpileModule([{
      fileName: 'mixin1.tsx',
      code: `
        export class Mixin {
          @Prop() omittedName: string = 'I should not exist';
          @Prop() includedName: string = 'I should exist';
          @Prop() includedName2: string = 'I should exist';
        }
      `
    }, {
      fileName: 'component.tsx',
      code: `
        import { Mixin } from 'mixin1';
        @Mixin(Mixin)
        @Component({
          tag: 'cmp-host'
        })
        export class CmpHost {}
        export interface CmpHost extends Omit<Mixin, 'omittedName' | "omittedName2"> {}
      `
    }]);

    expect(t.componentClassName).toBe('CmpHost');
    expect(t.tagName).toBe('cmp-host');

    expect(t.property.name).toBe('includedName');
    expect(t.property.defaultValue).toBe("'I should exist'");

    expect(t.properties[1].name).toBe('includedName2');
    expect(t.properties[1].defaultValue).toBe("'I should exist'");

    expect(t.properties[2]).toBe(undefined);
  });

  it('includes picked class members only', () => {
    const t = transpileModule([{
      fileName: 'mixin1.tsx',
      code: `
        export class Mixin {
          @Prop() pickedName: string = 'I should exist';
          @Prop() notPicked: string = 'I should not exist';
          @Prop() notPicked2: string = 'I should not exist';
          @Prop() pickedName2: string = 'I should exist';
        }
      `
    }, {
      fileName: 'component.tsx',
      code: `
        import { Mixin } from 'mixin1';
        @Mixin(Mixin)
        @Component({
          tag: 'cmp-host'
        })
        export class CmpHost {}
        export interface CmpHost extends Pick<Mixin, "pickedName" | \`pickedName2\`> {}
      `
    }]);

    expect(t.componentClassName).toBe('CmpHost');
    expect(t.tagName).toBe('cmp-host');

    expect(t.property.name).toBe('pickedName');
    expect(t.property.defaultValue).toBe("'I should exist'");

    expect(t.properties[1].name).toBe('pickedName2');
    expect(t.properties[1].defaultValue).toBe("'I should exist'");

    expect(t.properties[2]).toBe(undefined);
  });

  it('throws error when trying to use a mixin which uses mixins', () => {
    const t = transpileModule([{
      fileName: 'mixin1.tsx',
      code: `
        export class CmpA {}
      `
    }, {
      fileName: 'mixin2.tsx',
      code: `
        import { CmpA } from 'mixin1';
        @Mixin(CmpA)
        @Component({
          tag: 'cmp-b'
        }) export class CmpB {}
      `
    }, {
      fileName: 'component.tsx',
      code: `
        import { CmpB } from 'mixin2';
        @Mixin(CmpB)
        @Component({
          tag: 'cmp-host'
        })
        export class CmpHost {}
      `
    }]);
    expect(t.diagnostics[0].level).toBe('error');
    expect(t.diagnostics[0].messageText).toBe(`@Mixin decorator references a class (CmpB) that is itself decorated with a @Mixin (CmpA).
        In order to keep design and behaviour transparent, mixins cannot be nested. Consider refacoring.`);
  });

  it('throws warning when there are import name clashes', () => {
    const t = transpileModule([{
      fileName: 'mixin.tsx',
      code: `
        import { util } from 'utils';
        @Component({
          tag: 'cmp-b'
        }) export class CmpB {}
      `
    }, {
      fileName: 'component.tsx',
      code: `
        import { util } from 'different/utils';
        import { CmpB } from 'mixin';
        @Mixin(CmpB)
        @Component({
          tag: 'cmp-host'
        })
        export class CmpHost {}
      `
    }]);
    expect(t.diagnostics[0].level).toBe('warn');
    expect(t.diagnostics[0].messageText).toBe(`@Mixin import uses a name already used by another import (either within the host component or another @Mixin) which can lead to unexpected results. Consider renaming.`);
  });
});

