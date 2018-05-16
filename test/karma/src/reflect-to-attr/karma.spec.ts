import { setupDomTests, flush } from '../util';


describe('reflect-to-attr', function() {
  const { setupDom, tearDownDom } = setupDomTests(document);
  let app: HTMLElement;

  beforeEach(async () => {
    app = await setupDom('/reflect-to-attr/index.html');
  });
  afterEach(tearDownDom);

  // @Prop({reflectToAttr: true}) str = 'single';
  // @Prop({reflectToAttr: true}) nu = 2;
  // @Prop({reflectToAttr: true}) undef: string;
  // @Prop({reflectToAttr: true}) null: string = null;
  // @Prop({reflectToAttr: true}) bool = false;
  // @Prop({reflectToAttr: true}) otherBool = true;

  // @Prop({reflectToAttr: true, mutable: true}) dynamicStr: string;
  // @Prop({reflectToAttr: true}) dynamicNu: number;
  it('should have proper attributes', async () => {

    const cmp = app.querySelector('reflect-to-attr') as any;

    expect(cmp.getAttribute('str')).toEqual('single');
    expect(cmp.getAttribute('nu')).toEqual('2');
    expect(cmp.hasAttribute('undef')).toEqual(false);
    expect(cmp.hasAttribute('null')).toEqual(false);
    expect(cmp.hasAttribute('bool')).toEqual(false);
    expect(cmp.getAttribute('other-bool')).toEqual('');

    cmp.str = 'second';
    cmp.nu = -12.2;
    cmp.undef = 'no undef';
    cmp.null = 'no null';
    cmp.bool = true;
    cmp.otherBool = false;

    await flush(app);

    expect(cmp.getAttribute('str')).toEqual('second');
    expect(cmp.getAttribute('nu')).toEqual('-12.2');
    expect(cmp.getAttribute('undef')).toEqual('no undef');
    expect(cmp.getAttribute('null')).toEqual('no null');
    expect(cmp.getAttribute('bool')).toEqual('');
    expect(cmp.hasAttribute('other-bool')).toEqual(false);

    expect(cmp.getAttribute('dynamic-str')).toEqual('value');
    expect(cmp.getAttribute('dynamic-nu')).toEqual('123');
  });

});
