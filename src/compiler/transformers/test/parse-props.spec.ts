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
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'string',
          'text': 'string'
        },
        'mutable': false,
        'optional': true,
        'reflectToAttr': false,
        'required': false,
        'type': 'string'
      }
    });

    expect(t.property.attr).toBe('val');
    expect(t.property.type).toBe('string');
    expect(t.property.optional).toBe(true);
    expect(t.cmpCompilerMeta.features.hasProp).toBe(true);
  });

  it('prop required', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val!: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'string',
          'text': 'string'
        },
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': true,
        'type': 'string'
      }
    });
    expect(t.property.required).toBe(true);
  });

  it('prop mutable', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop({ mutable: true }) val: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'string',
          'text': 'string'
        },
        'defaultValue': undefined,
        'mutable': true,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'string'
      }
    });
    expect(t.property.mutable).toBe(true);
  });

  it('prop reflectAttr', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop({ reflectToAttr: true }) val: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'string',
          'text': 'string'
        },
        'mutable': false,
        'optional': false,
        'reflectToAttr': true,
        'required': false,
        'type': 'string'
      }
    });
    expect(t.property.reflectToAttr).toBe(true);
    expect(t.cmpCompilerMeta.features.hasReflectToAttr).toBe(true);
  });

  it('prop array', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: string[];
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'complexType': {
          'references': {},
          'resolved': '{}', // TODO, needs to be string[]
          'text': 'string[]'
        },
        'mutable': false,
        'optional': false,
        'required': false,
        'type': 'unknown'
      }
    });
    expect(t.property.type).toBe('unknown');
    expect(t.property.attr).toBe(null);
    expect(t.property.reflectToAttr).toBe(false);
  });

  it('prop object', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: Object;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {
            'Object': {
              'location': 'global'
            }
          },
          'resolved': 'any',
          'text': 'Object'
        },
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'any'
      }
    });
    expect(t.property.type).toBe('any');
    expect(t.property.attr).toBe('val');
    expect(t.property.reflectToAttr).toBe(false);
  });

  it('prop multiword', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() multiWord: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'multiWord': {
        'attr': 'multi-word',
        'complexType': {
          'references': {},
          'resolved': 'string',
          'text': 'string'
        },
        'defaultValue': undefined,
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'string'
      }
    });
    expect(t.property.name).toBe('multiWord');
    expect(t.property.attr).toBe('multi-word');
  });

  it('prop w/ string type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: string;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'string',
          'text': 'string'
        },
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'string'
      }
    });
    expect(t.property.type).toBe('string');
    expect(t.property.attr).toBe('val');
  });

  it('prop w/ number type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: number;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'number',
          'text': 'number'
        },
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'number'
      }
    });
    expect(t.property.type).toBe('number');
    expect(t.property.attr).toBe('val');
  });

  it('prop w/ boolean type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: boolean;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'boolean',
          'text': 'boolean'
        },
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'boolean'
      }
    });
    expect(t.property.type).toBe('boolean');
    expect(t.property.attr).toBe('val');
  });

  it('prop w/ any type', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: any;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'any',
          'text': 'any'
        },
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'any'
      }
    });
    expect(t.property.type).toBe('any');
    expect(t.property.attr).toBe('val');
  });

  it('prop w/ inferred string type', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = 'mph';
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'string',
          'text': 'string'
        },
        'defaultValue': `'mph'`,
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'string'
      }
    });
    expect(t.property.type).toBe('string');
    expect(t.property.attr).toBe('val');
  });

  it('prop w/ inferred number type', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = 88;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'number',
          'text': 'number'
        },
        'defaultValue': '88',
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'number'
      }
    });
    expect(t.property.type).toBe('number');
    expect(t.property.attr).toBe('val');
  });

  it('prop w/ inferred boolean type', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = false;
      }
    `);
    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'boolean',
          'text': 'boolean'
        },
        'defaultValue': 'false',
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'boolean'
      }
    });
    expect(t.property.type).toBe('boolean');
    expect(t.property.attr).toBe('val');
  });

  it('prop w/ inferred any type from null', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = null;
      }
    `);

    expect(getStaticGetter(t.outputText, 'properties')).toEqual({
      'val': {
        'attr': 'val',
        'complexType': {
          'references': {},
          'resolved': 'any',
          'text': 'any'
        },
        'defaultValue': 'null',
        'mutable': false,
        'optional': false,
        'reflectToAttr': false,
        'required': false,
        'type': 'any'
      }
    });
    expect(t.property.type).toBe('any');
    expect(t.property.attr).toBe('val');
  });

});
