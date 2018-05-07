import { mockCompilerCtx, mockConfig } from '../../../testing/mocks';
import { transformSourceString } from '../transformers/util';
import { createCustomElements } from '../transformers/create-custom-element';

const source = `
class ActionSheet {
  objectAnyThing: (_) => Promise<OtherThing>;

  size: string;

  withOptions = 88;
}
`;


describe('create custom element', () => {

  const config = mockConfig();

  it(`should add custom element stuff`, async () => {
    const fileName = 'fileName';
    const compilerCtx = mockCompilerCtx();
    compilerCtx.moduleFiles = {
      [fileName]: {
        cmpMeta: {
          componentClass: 'ActionSheet'
        }
      }
    };
    const output = await transformSourceString(fileName, source, [ createCustomElements(compilerCtx) ]);
    expect(
      output
    ).toEqual(
`import { h, StencilElement } from "@stencil/core";
class ActionSheet extends StencilElement {
    objectAnyThing: (_) => Promise<OtherThing>;
    size: string;
    withOptions = 88;
}
`
    );
  });
});
