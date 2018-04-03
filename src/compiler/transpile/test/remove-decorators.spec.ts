import { mockConfig } from '../../../testing/mocks';
import { transformSourceString } from '../transformers/util';
import { removeDecorators } from '../transformers/remove-decorators';

const source = `
/**
 * This is an actionSheet class
 */
@Component({
  tag: 'ion-action-sheet',
  styleUrls: {
    ios: 'action-sheet.ios.scss',
    md: 'action-sheet.md.scss'
  },
  host: {
    theme: 'action-sheet'
  }
})
class ActionSheet {
  /**
   * Create method for something
   */
  @Prop() @Test() objectAnyThing: (_) => Promise<OtherThing>;

  @Prop() size: string;

  @Prop({
    attr: 'my-custom-attr-name',
    reflectToAttr: true
  }) withOptions = 88;
}
`;


describe('method decorator', () => {

  const config = mockConfig();

  it(`should not remove unknown decorators`, async () => {
    const output = await transformSourceString('fileName', source, [ removeDecorators() ]);
    expect(
      output
    ).toEqual(
`/**
 * This is an actionSheet class
 */
class ActionSheet {
    /**
     * Create method for something
     */
    @Test()
    objectAnyThing: (_) => Promise<OtherThing>;
    size: string;
    withOptions = 88;
}
`
    );
  });
});
