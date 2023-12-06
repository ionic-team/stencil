import { getStaticGetter, transpileModule } from './transpile';
describe('parse props', () => {
    it('prop optional', () => {
        var _a, _b, _c, _d;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.attribute).toBe('val');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.type).toBe('string');
        expect((_c = t.property) === null || _c === void 0 ? void 0 : _c.optional).toBe(true);
        expect((_d = t.cmp) === null || _d === void 0 ? void 0 : _d.hasProp).toBe(true);
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
        var _a;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.required).toBe(true);
    });
    it('prop mutable', () => {
        var _a;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.mutable).toBe(true);
    });
    it('prop reflectAttr', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.reflect).toBe(true);
        expect((_b = t.cmp) === null || _b === void 0 ? void 0 : _b.hasReflect).toBe(true);
    });
    it('prop array', () => {
        var _a, _b, _c;
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
                    resolved: '{}',
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('unknown');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe(undefined);
        expect((_c = t.property) === null || _c === void 0 ? void 0 : _c.reflect).toBe(false);
    });
    it('prop object', () => {
        var _a, _b, _c;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('any');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
        expect((_c = t.property) === null || _c === void 0 ? void 0 : _c.reflect).toBe(false);
    });
    it('prop multiword', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.name).toBe('multiWord');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('multi-word');
    });
    it('prop w/ string type', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('string');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
    });
    it('prop w/ number type', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('number');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
    });
    it('prop w/ boolean type', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('boolean');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
    });
    it('prop w/ any type', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('any');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
    });
    it('prop w/ inferred string type', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('string');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
    });
    it('prop w/ inferred number type', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('number');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
    });
    it('prop w/ inferred boolean type', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('boolean');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
    });
    it('prop w/ inferred any type from null', () => {
        var _a, _b;
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
        expect((_a = t.property) === null || _a === void 0 ? void 0 : _a.type).toBe('any');
        expect((_b = t.property) === null || _b === void 0 ? void 0 : _b.attribute).toBe('val');
    });
});
//# sourceMappingURL=parse-props.spec.js.map