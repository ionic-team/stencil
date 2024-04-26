import { mockBuildCtx, mockCompilerCtx, mockModule, mockValidatedConfig } from '@stencil/core/testing';
import { getComponentsFromModules } from '@utils';

import type * as d from '../../../declarations';
import { stubComponentCompilerMeta } from '../../types/tests/ComponentCompilerMeta.stub';
import { AUTO_GENERATE_COMMENT } from '../constants';
import { generateDocData, getDocsStyles } from '../generate-doc-data';

describe('generate-doc-data', () => {
  describe('getDocsComponents', () => {
    let moduleCmpWithJsdoc: d.Module;
    let moduleCmpNoJsdoc: d.Module;

    beforeEach(() => {
      moduleCmpWithJsdoc = mockModule({
        cmps: [
          stubComponentCompilerMeta({
            docs: {
              tags: [],
              text: 'This is the overview of `my-component`',
            },
          }),
        ],
      });
      moduleCmpNoJsdoc = mockModule({
        cmps: [
          stubComponentCompilerMeta({
            docs: {
              tags: [],
              text: '',
            },
          }),
        ],
      });
    });

    /**
     * Setup function for the {@link generateDocData} function exported by the module under test
     * @param moduleMap a map of {@link d.ModuleMap} entities to add to the returned compiler and build contexts
     * @returns the arguments required to invoke the method under test
     */
    const setup = (
      moduleMap: d.ModuleMap,
    ): { validatedConfig: d.ValidatedConfig; compilerCtx: d.CompilerCtx; buildCtx: d.BuildCtx } => {
      const validatedConfig: d.ValidatedConfig = mockValidatedConfig();

      const compilerCtx: d.CompilerCtx = mockCompilerCtx(validatedConfig);
      compilerCtx.moduleMap = moduleMap;

      const modules = Array.from(compilerCtx.moduleMap.values());
      const buildCtx: d.BuildCtx = mockBuildCtx(validatedConfig, compilerCtx);
      buildCtx.moduleFiles = modules;
      buildCtx.components = getComponentsFromModules(modules);

      return { validatedConfig, compilerCtx, buildCtx };
    };

    describe('component JSDoc overview', () => {
      it("takes the value from the component's JSDoc", async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set('path/to/component.tsx', moduleCmpWithJsdoc);
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.overview).toBe('This is the overview of `my-component`');
      });

      it('sets the value to the empty string when there is no JSDoc', async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set('path/to/component.tsx', moduleCmpNoJsdoc);
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.overview).toBe('');
      });
    });

    describe('docs content', () => {
      it("sets the field's contents to the jsdoc text if present", async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set('path/to/component.tsx', moduleCmpWithJsdoc);
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.docs).toBe('This is the overview of `my-component`');
      });

      it("sets the field's contents to an empty string if neither the readme, nor jsdoc are set", async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set('path/to/component.tsx', moduleCmpNoJsdoc);
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.docs).toBe('');
      });

      it("sets the field's contents to an empty string if the readme doesn't contain the autogenerated comment", async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set('path/to/component.tsx', moduleCmpNoJsdoc);
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        await compilerCtx.fs.writeFile('readme.md', 'this is manually generated user content');

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.docs).toBe('');
      });

      it("sets the field's contents to manually generated content when the autogenerated comment is present", async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set('path/to/component.tsx', moduleCmpNoJsdoc);
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        await compilerCtx.fs.writeFile(
          'readme.md',
          `this is manually generated user content\n${AUTO_GENERATE_COMMENT}\nauto-generated content`,
        );

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.docs).toBe('this is manually generated user content');
      });

      it("sets the field's contents to a subset of the manually generated content", async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set('path/to/component.tsx', moduleCmpNoJsdoc);
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        const readmeContent = `
this is manually generated user content

# user header
user content

# another user header
more user content

${AUTO_GENERATE_COMMENT}

#some-header

auto-generated content
`;
        await compilerCtx.fs.writeFile('readme.md', readmeContent);

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.docs).toBe('this is manually generated user content');
      });

      it("sets the field's contents to a an empty string when the manually generated content starts with a '#'", async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set('path/to/component.tsx', moduleCmpNoJsdoc);
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        const readmeContent = `
# header that leads to skipping
this is manually generated user content

# user header
user content

# another user header
more user content

${AUTO_GENERATE_COMMENT}

#some-header

auto-generated content
`;
        await compilerCtx.fs.writeFile('readme.md', readmeContent);

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.docs).toBe('');
      });
    });
  });

  describe('getDocsStyles', () => {
    it('returns an empty array if no styleDocs exist on the compiler metadata', () => {
      const compilerMeta = stubComponentCompilerMeta();
      // @ts-ignore - the intent of this test is to verify allocation of a new array if for some reason this is missing
      compilerMeta.styleDocs = null;

      const actual = getDocsStyles(compilerMeta);

      expect(actual).toEqual([]);
    });

    it('returns an empty array if empty styleDocs exist on the compiler metadata', () => {
      const compilerMeta = stubComponentCompilerMeta({ styleDocs: [] });

      const actual = getDocsStyles(compilerMeta);

      expect(actual).toEqual([]);
    });

    it("returns a 'sorted' array of one CompilerStyleDoc", () => {
      const compilerStyleDoc: d.CompilerStyleDoc = {
        annotation: 'prop',
        docs: 'these are the docs for this prop',
        name: 'my-style-one',
      };
      const compilerMeta = stubComponentCompilerMeta({ styleDocs: [compilerStyleDoc] });

      const actual = getDocsStyles(compilerMeta);

      expect(actual).toEqual([compilerStyleDoc]);
    });

    it('returns a sorted array from multiple CompilerStyleDoc', () => {
      const compilerStyleDocOne: d.CompilerStyleDoc = {
        annotation: 'prop',
        docs: 'these are the docs for my-style-a',
        name: 'my-style-a',
      };
      const compilerStyleDocTwo: d.CompilerStyleDoc = {
        annotation: 'prop',
        docs: 'these are more docs for my-style-b',
        name: 'my-style-b',
      };
      const compilerStyleDocThree: d.CompilerStyleDoc = {
        annotation: 'prop',
        docs: 'these are more docs for my-style-c',
        name: 'my-style-c',
      };
      const compilerMeta = stubComponentCompilerMeta({
        styleDocs: [compilerStyleDocOne, compilerStyleDocThree, compilerStyleDocTwo],
      });

      const actual = getDocsStyles(compilerMeta);

      expect(actual).toEqual([compilerStyleDocOne, compilerStyleDocTwo, compilerStyleDocThree]);
    });
  });

  it("returns CompilerStyleDoc with the same name in the order they're provided", () => {
    const compilerStyleDocOne: d.CompilerStyleDoc = {
      annotation: 'prop',
      docs: 'these are the docs for my-style-a (first lowercase)',
      name: 'my-style-a',
    };
    const compilerStyleDocTwo: d.CompilerStyleDoc = {
      annotation: 'prop',
      docs: 'these are more docs for my-style-A (only capital)',
      name: 'my-style-A',
    };
    const compilerStyleDocThree: d.CompilerStyleDoc = {
      annotation: 'prop',
      docs: 'these are more docs for my-style-a (second lowercase)',
      name: 'my-style-a',
    };
    const compilerMeta = stubComponentCompilerMeta({
      styleDocs: [compilerStyleDocOne, compilerStyleDocThree, compilerStyleDocTwo],
    });

    const actual = getDocsStyles(compilerMeta);

    expect(actual).toEqual([compilerStyleDocOne, compilerStyleDocThree, compilerStyleDocTwo]);
  });

  describe('default values', () => {
    it.each(['', null, undefined])(
      'defaults the annotation to an empty string if %s is provided',
      (annotationValue) => {
        const compilerStyleDoc: d.CompilerStyleDoc = {
          annotation: 'prop',
          docs: 'these are the docs for this prop',
          name: 'my-style-one',
        };
        // @ts-ignore the intent of this test to verify the fallback of this field if it's falsy
        compilerStyleDoc.annotation = annotationValue;

        const compilerMeta = stubComponentCompilerMeta({ styleDocs: [compilerStyleDoc] });

        const actual = getDocsStyles(compilerMeta);

        expect(actual).toEqual([
          {
            annotation: '',
            docs: 'these are the docs for this prop',
            name: 'my-style-one',
          },
        ]);
      },
    );

    it.each(['', null, undefined])('defaults the docs to an empty string if %s is provided', (docsValue) => {
      const compilerStyleDoc: d.CompilerStyleDoc = {
        annotation: 'prop',
        docs: 'these are the docs for this prop',
        name: 'my-style-one',
      };
      // @ts-ignore the intent of this test to verify the fallback of this field if it's falsy
      compilerStyleDoc.docs = docsValue;

      const compilerMeta = stubComponentCompilerMeta({ styleDocs: [compilerStyleDoc] });

      const actual = getDocsStyles(compilerMeta);

      expect(actual).toEqual([
        {
          annotation: 'prop',
          docs: '',
          name: 'my-style-one',
        },
      ]);
    });
  });
});
