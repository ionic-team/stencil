import { transpile } from '../transpile';


describe('transpile', () => {

  it('should just transpile text', () => {
    const code = transpile(`
      @Component({
        tag: 'my-component'
      })
      export MyComponent {
        @Prop() first: string;
        @Prop() last: string;
        return (
          <div>
            Hello, World! I'm {this.first} {this.last}
          </div>
        );
      }
    `);
    expect(code).toBeDefined();
  });

});
