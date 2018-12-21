import { transpileModule } from './transpile';


describe('parse props', () => {

  it('prop required', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val?: string;
      }
    `);
    expect(t.outputText).toContain(`{ 'val': { 'type': 'string', 'attr': 'val', 'optional': true } }`);

    expect(t.property.attr).toBe('val');
    expect(t.property.type).toBe('string');
    expect(t.property.optional).toBe(true);
    expect(t.cmpCompilerMeta.hasProp).toBe(true);
  });

  it('prop required', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val!: string;
      }
    `);
    expect(t.outputText).toContain(`{ 'val': { 'type': 'string', 'attr': 'val', 'required': true } }`);
    expect(t.property.required).toBe(true);
  });

  it('prop mutable', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop({ mutable: true }) val: string;
      }
    `);
    expect(t.outputText).toContain(`{ 'val': { 'type': 'string', 'attr': 'val', 'mutable': true } }`);
    expect(t.property.mutable).toBe(true);
  });

  it('prop reflectAttr', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop({ reflectToAttr: true }) val: string;
      }
    `);
    expect(t.outputText).toContain(`{ 'val': { 'type': 'string', 'attr': 'val', 'reflectToAttr': true } }`);
    expect(t.property.reflectToAttr).toBe(true);
    expect(t.cmpCompilerMeta.hasReflectToAttr).toBe(true);
  });

  it('prop array', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: string[];
      }
    `);
    expect(t.outputText).toContain(`{ 'val': { 'type': 'array' } }`);
    expect(t.property.type).toBe('array');
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
    expect(t.outputText).toContain(`{ 'val': { 'type': 'object' } }`);
    expect(t.property.type).toBe('object');
    expect(t.property.attr).toBe(null);
    expect(t.property.reflectToAttr).toBe(false);
  });

  it('prop multiword', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() multiWord: string;
      }
    `);
    expect(t.outputText).toContain(`{ 'multiWord': { 'type': 'string', 'attr': 'multi-word' } }`);

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
    expect(t.outputText).toContain(`{ 'val': { 'type': 'string', 'attr': 'val' } }`);
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
    expect(t.outputText).toContain(`{ 'val': { 'type': 'number', 'attr': 'val' } }`);
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
    expect(t.outputText).toContain(`{ 'val': { 'type': 'boolean', 'attr': 'val' } }`);
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
    expect(t.outputText).toContain(`{ 'val': { 'attr': 'val' } }`);
    expect(t.property.type).toBe('unknown');
    expect(t.property.attr).toBe('val');
  });

  it('prop w/ inferred string type', () => {
    const t = transpileModule(`
      @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val = 'mph';
      }
    `);
    expect(t.outputText).toContain(`{ 'val': { 'type': 'string', 'attr': 'val' } }`);
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
    expect(t.outputText).toContain(`{ 'val': { 'type': 'number', 'attr': 'val' } }`);
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
    expect(t.outputText).toContain(`{ 'val': { 'type': 'boolean', 'attr': 'val' } }`);
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

    expect(t.outputText).toContain(`{ 'val': { 'attr': 'val' } }`);
    expect(t.property.type).toBe('unknown');
    expect(t.property.attr).toBe('val');
  });

});
