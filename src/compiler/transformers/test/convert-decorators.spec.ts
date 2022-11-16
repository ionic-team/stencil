import { transpileModule } from './transpile';

/**
 * c for compact, c for class declaration, make of it what you will!
 *
 * a little util to take a multiline template literal and convert it to a
 * single line, with any whitespace substrings converting to single spaces.
 * this can help us compare with the output of `transpileModule`.
 *
 * @param strings an array of strings from a template literal
 * @returns a formatted string!
 */
function c(strings: TemplateStringsArray) {
  return strings.join('').replace('\n', ' ').replace(/\s+/g, ' ');
}

describe('convert-decorators', () => {
  it('should convert `@Prop` class fields to properties', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val: string = "initial value";
      }
    `);

    // we test the whole output here to ensure that the field has been
    // removed from the class body correctly and replaced with an initializer
    // in the constructor
    expect(t.outputText).toBe(
      c`export class CmpA {
        constructor() {
          this.val = "initial value";
        }

        static get is() {
          return "cmp-a";
        }

        static get properties() {
          return {
            "val": {
              "type": "string",
              "mutable": false,
              "complexType": {
                "original": "string",
                "resolved": "string",
                "references": {}
              },
              "required": false,
              "optional": false,
              "docs": {
                "tags": [],
                "text": "" 
              },
              "getter": false, 
              "setter": false,
              "attribute": "val",
              "reflect": false,
              "defaultValue": "\\"initial value\\""
            }
          };
        }}`
    );
  });

  it('should initialize decorated class fields to undefined, if nothing provided', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
        @Prop() val?: string;
      }
    `);

    // we test the whole output here to ensure that the field has been
    // removed from the class body correctly and replaced with an initializer
    // in the constructor
    expect(t.outputText).toContain(
      c`constructor() {
          this.val = undefined;
      }`
    );
  });

  it('should convert `@State` class fields to properties', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-b'})
      export class CmpB {
        @State() count: number = 0;
      }
    `);

    // we test the whole output here to ensure that the field has been
    // removed from the class body correctly and replaced with an initializer
    // in the constructor
    expect(t.outputText).toBe(
      c`export class CmpB {
        constructor() {
          this.count = 0;
        }

        static get is() {
          return "cmp-b";
        }

        static get states() {
          return {
            "count": {}
          };
        }}`
    );
  });

  it('should not add a constructor if no class fields are present', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {
      }
    `);

    // we test the whole output here to ensure that the field has been
    // removed from the class body correctly and replaced with an initializer
    // in the constructor
    expect(t.outputText).toBe(
      c`export class CmpA {
        static get is() {
          return "cmp-a";
        }}`
    );
  });

  it('should add a super call to the constructor if necessary', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA extends Foobar {
        @State() count: number = 0;
      }
    `);

    expect(t.outputText).toBe(
      c`export class CmpA extends Foobar {
        constructor() {
          super();
          this.count = 0;
        }

        static get states() {
          return {
            "count": {}
          };
        }}`
    );
  });

  it('should preserve statements in an existing constructor', () => {
    const t = transpileModule(`
    @Component({
      tag: 'my-component',
    })
    export class MyComponent {
      constructor() {
        console.log('boop');
      }
    }`);

    expect(t.outputText).toBe(
      c`export class MyComponent {
        constructor() {
          console.log('boop');
        }

        static get is() {
          return "my-component";
      }}`
    );
  });

  it('should preserve statements in an existing constructor w/ @Prop', () => {
    const t = transpileModule(`
    @Component({
      tag: 'my-component',
    })
    export class MyComponent {
      @Prop() count: number;

      constructor() {
        console.log('boop');
      }
    }`);

    expect(t.outputText).toContain(
      c`constructor() {
          this.count = undefined;
          console.log('boop');
        }`
    );
  });

  it('should allow user to initialize field in an existing constructor w/ @Prop', () => {
    const t = transpileModule(`
    @Component({
      tag: 'my-component',
    })
    export class MyComponent {
      @Prop() count: number;

      constructor() {
        this.count = 3;
      }
    }`);

    // the initialization we do to `undefined` (since no value is present)
    // should be before the user's `this.count = 3` to ensure that their code
    // wins.
    expect(t.outputText).toContain(
      c`constructor() {
          this.count = undefined;
          this.count = 3;
        }`
    );
  });

  it('should preserve statements in an existing constructor w/ non-decorated field', () => {
    const t = transpileModule(`
    @Component({
      tag: 'example',
    })
    export class Example implements FooBar {
      private classProps: Array<string>;

      constructor() {
        this.classProps = ["variant", "theme"];
      }
    }`);

    expect(t.outputText).toBe(
      c`export class Example {
        constructor() {
          this.classProps = ["variant", "theme"];
        }}`
    );
  });

  it('should preserve statements in an existing constructor super, decorated field', () => {
    const t = transpileModule(`
    @Component({
      tag: 'example',
    })
    export class Example extends Parent {
      @Prop() foo: string = "bar";

      constructor() {
        console.log("hello!")
      }
    }`);

    expect(t.outputText).toContain(
      c`constructor() {
        super();
        this.foo = "bar";
        console.log("hello!");
      }`
    );
  });

  it('should not add a super call to the constructor if not necessary', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA implements Foobar {
        @State() count: number = 0;
      }
    `);

    expect(t.outputText).toBe(
      c`export class CmpA {
        constructor() {
          this.count = 0;
        }

        static get is() {
          return "cmp-a";
        }

        static get states() {
          return {
            "count": {}
          };
        }}`
    );
  });

  it('should not convert `@Event` fields to constructor-initialization', () => {
    const t = transpileModule(`
    @Component({tag: 'cmp-a'})
      export class CmpA {

      @Event({
        eventName: 'my-event-with-options',
        bubbles: false,
        cancelable: false,
      })
      myEventWithOptions: EventEmitter<{ mph: number }>;
    }
    `);

    // we test the whole output here to ensure that the field has been
    // removed from the class body correctly and replaced with an initializer
    // in the constructor
    expect(t.outputText).toBe(
      c`export class CmpA {
        static get is() {
          return "cmp-a";
        }

        static get events() {
          return [{
            "method": "myEventWithOptions",
            "name": "my-event-with-options",
            "bubbles": false,
            "cancelable": false,
            "composed": true,
            "docs": {
              "tags": [],
              "text": "" 
            },            
            "complexType": {
              "original": "{ mph: number }",
              "resolved": "{ mph: number; }",
              "references": {}
            }
          }];
      }}`
    );
  });
});
