import { getStaticGetter, transpileModule } from './transpile';

describe('parse props', () => {
  it('prop optional', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val?: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'string',
          original: 'string',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: true,
        reflect: false,
        required: false,
        type: 'string',
      },
    });

    expect(t.property?.attribute).toBe('val');
    expect(t.property?.type).toBe('string');
    expect(t.property?.optional).toBe(true);
    expect(t.cmp?.hasProp).toBe(true);
  });

  it('should correctly parse a prop with an inferred enum type', () => {
    const t = transpileModule(`
    export enum Mode {
      DEFAULT = 'default'
    }
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: Mode;
      }
    `);

    // Using the `properties` array directly here since the `transpileModule`
    // method doesn't like the top-level enum export with the current `target` and
    // `module` values for the tsconfig
    expect(t.properties[0]).toEqual({
      name: 'val',
      type: 'string',
      attribute: 'val',
      reflect: false,
      mutable: false,
      required: false,
      optional: false,
      defaultValue: undefined,
      complexType: {
        original: 'Mode',
        resolved: 'Mode',
        references: {
          Mode: { location: 'local', path: 'module.tsx', id: 'module.tsx::Mode' },
        },
      },
      docs: { tags: [], text: '' },
      internal: false,
    });
  });

  it('should correctly parse a prop with an unresolved type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val?: Foo;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {
            Foo: {
              id: 'global::Foo',
              location: 'global',
            },
          },
          resolved: 'Foo',
          original: 'Foo',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: true,
        reflect: false,
        required: false,
        type: 'any',
      },
    });
  });

  it('prop required', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val!: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'string',
          original: 'string',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: false,
        reflect: false,
        required: true,
        type: 'string',
      },
    });
    expect(t.property?.required).toBe(true);
  });

  it('prop mutable', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop({ mutable: true }) val: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'string',
          original: 'string',
        },
        defaultValue: undefined,
        docs: {
          text: '',
          tags: [],
        },
        mutable: true,
        optional: false,
        reflect: false,
        required: false,
        type: 'string',
      },
    });
    expect(t.property?.mutable).toBe(true);
  });

  it('prop reflectAttr', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop({ reflect: true }) val: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'string',
          original: 'string',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: false,
        reflect: true,
        required: false,
        type: 'string',
      },
    });
    expect(t.property?.reflect).toBe(true);
    expect(t.cmp?.hasReflect).toBe(true);
  });

  it('prop array', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: string[];
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        complexType: {
          references: {},
          resolved: '{}', // TODO, needs to be string[]
          original: 'string[]',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: false,
        required: false,
        type: 'unknown',
      },
    });
    expect(t.property?.type).toBe('unknown');
    expect(t.property?.attribute).toBe(undefined);
    expect(t.property?.reflect).toBe(false);
  });

  it('prop object', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: Object;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {
            Object: {
              location: 'global',
              id: 'global::Object',
            },
          },
          resolved: 'Object',
          original: 'Object',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'any',
      },
    });
    expect(t.property?.type).toBe('any');
    expect(t.property?.attribute).toBe('val');
    expect(t.property?.reflect).toBe(false);
  });

  it('prop multiword', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() multiWord: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      multiWord: {
        attribute: 'multi-word',
        complexType: {
          references: {},
          resolved: 'string',
          original: 'string',
        },
        docs: {
          text: '',
          tags: [],
        },
        defaultValue: undefined,
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'string',
      },
    });
    expect(t.property?.name).toBe('multiWord');
    expect(t.property?.attribute).toBe('multi-word');
  });

  it('prop w/ string type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'string',
          original: 'string',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'string',
      },
    });
    expect(t.property?.type).toBe('string');
    expect(t.property?.attribute).toBe('val');
  });

  it('prop w/ number type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: number;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'number',
          original: 'number',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'number',
      },
    });
    expect(t.property?.type).toBe('number');
    expect(t.property?.attribute).toBe('val');
  });

  it('prop w/ boolean type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: boolean;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'boolean',
          original: 'boolean',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'boolean',
      },
    });
    expect(t.property?.type).toBe('boolean');
    expect(t.property?.attribute).toBe('val');
  });

  it('prop w/ any type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: any;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'any',
          original: 'any',
        },
        docs: {
          text: '',
          tags: [],
        },
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'any',
      },
    });
    expect(t.property?.type).toBe('any');
    expect(t.property?.attribute).toBe('val');
  });

  it('prop w/ inferred string type', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = 'mph';
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'string',
          original: 'string',
        },
        docs: {
          text: '',
          tags: [],
        },
        defaultValue: `'mph'`,
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'string',
      },
    });
    expect(t.property?.type).toBe('string');
    expect(t.property?.attribute).toBe('val');
  });

  it('prop w/ inferred number type', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = 88;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'number',
          original: 'number',
        },
        docs: {
          text: '',
          tags: [],
        },
        defaultValue: '88',
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'number',
      },
    });
    expect(t.property?.type).toBe('number');
    expect(t.property?.attribute).toBe('val');
  });

  it('prop w/ inferred boolean type', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = false;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'boolean',
          original: 'boolean',
        },
        docs: {
          text: '',
          tags: [],
        },
        defaultValue: 'false',
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'boolean',
      },
    });
    expect(t.property?.type).toBe('boolean');
    expect(t.property?.attribute).toBe('val');
  });

  it('prop w/ inferred any type from null', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = null;
      }
    `);

    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      val: {
        attribute: 'val',
        complexType: {
          references: {},
          resolved: 'any',
          original: 'any',
        },
        docs: {
          text: '',
          tags: [],
        },
        defaultValue: 'null',
        mutable: false,
        optional: false,
        reflect: false,
        required: false,
        type: 'any',
      },
    });
    expect(t.property?.type).toBe('any');
    expect(t.property?.attribute).toBe('val');
  });
});
