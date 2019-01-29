import { transpileModule } from './transpile';


describe('parse comments', () => {

  it('should parse all comments', () => {
    const t = transpileModule(`
      /**
       * Comments
       * @usage Hello
       */
      @Component({
        tag: 'cmp-a'
      })
      export class CmpA {
        /**
         * This is a prop
         * @required hello
         */
        @Prop() prop: 'md';

        /**
         * This is a method
         */
        @Method()
        async method(prop: string) {
          return 42;
        }

        /**
         * This is an event
         */
        @Event() event;
      }
    `);

    expect(t.property).toEqual({
      'attribute': 'prop',
      'complexType': {
        'references': {},
        'resolved': '"md"',
        'text': '\'md\'',
      },
      'defaultValue': undefined,
      'docs': {
        'tags': [{
          'name': 'required',
          'text': 'hello'
        }],
        'text': 'This is a prop',
      },
      'mutable': false,
      'name': 'prop',
      'optional': false,
      'reflect': false,
      'required': false,
      'type': 'string',
    });
    expect(t.method).toEqual({
      'complexType': {
        'parameters': [
          {
            'tags': [],
            'text': '',
          },
        ],
        'returns': {
          'docs': '',
          'type': '{}',
        },
        'signature': '(prop: string) => {}',
      },
      'docs': {
        'tags': [],
        'text': 'This is a method',
      },
      'name': 'method',
    });
    expect(t.event).toEqual({
      'bubbles': true,
      'cancelable': true,
      'composed': true,
      'docs': {
        'tags': [],
        'text': 'This is an event',
      },
      'method': 'event',
      'name': 'event',
    });
    expect(t.cmp.docs).toEqual({
      'tags': [
        {
          'name': 'usage',
          'text': 'Hello',
        },
      ],
      'text': 'Comments',
    });

  });

});
