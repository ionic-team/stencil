import { mockBuildCtx, mockCompilerCtx, mockModule, mockValidatedConfig } from '@stencil/core/testing';

import type * as d from '../../../declarations';
import { getComponentsFromModules } from '../../output-targets/output-utils';
import { stubComponentCompilerMeta } from '../../types/tests/ComponentCompilerMeta.stub';
import { generateDocData } from '../generate-doc-data';

describe('generate-doc-data', () => {
  describe('getDocsComponents', () => {
    /**
     * Setup function for the {@link generateDocData} function exported by the module under test
     * @param moduleMap a map of {@link d.ModuleMap} entities to add to the returned compiler and build contexts
     * @returns the arguments required to invoke the method under test
     */
    const setup = (
      moduleMap: d.ModuleMap
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
        moduleMap.set(
          'path/to/component.tsx',
          mockModule({
            cmps: [
              stubComponentCompilerMeta({
                docs: {
                  tags: [],
                  text: 'This is the overview of `my-component`',
                },
              }),
            ],
          })
        );
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.overview).toBe('This is the overview of `my-component`');
      });

      it('sets the value to the empty string when there is no JSDoc', async () => {
        const moduleMap: d.ModuleMap = new Map();
        moduleMap.set(
          'path/to/component.tsx',
          mockModule({
            cmps: [
              stubComponentCompilerMeta({
                docs: {
                  tags: [],
                  text: '',
                },
              }),
            ],
          })
        );
        const { validatedConfig, compilerCtx, buildCtx } = setup(moduleMap);

        const generatedDocData = await generateDocData(validatedConfig, compilerCtx, buildCtx);

        expect(generatedDocData.components).toHaveLength(1);
        const componentDocData = generatedDocData.components[0];
        expect(componentDocData.overview).toBe('');
      });
    });
  });
});
