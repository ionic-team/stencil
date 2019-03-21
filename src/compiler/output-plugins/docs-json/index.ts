import * as d from '../../../declarations';

export const plugin: d.Plugin<d.OutputTargetDocsJson> = {
  name: 'docs-json',
  validate(outputTarget, config) {
    return normalizeOutputTarget(config, outputTarget);
  },
  async createOutput(outputTargets, _config, compilerCtx, _buildCtx, docsData) {
    const json = {
      ...docsData,
      components: docsData.components.map(cmp => ({
        tag: cmp.tag,
        encapsulation: cmp.encapsulation,
        readme: cmp.readme,
        docs: cmp.docs,
        docsTags: cmp.docsTags,
        usage: cmp.usage,
        props: cmp.props,
        methods: cmp.methods,
        events: cmp.events,
        styles: cmp.styles,
        slots: cmp.slots
      }))
    };
    const jsonContent = JSON.stringify(json, null, 2);
    await Promise.all(
      outputTargets.map(jsonOutput => {
        return compilerCtx.fs.writeFile(jsonOutput.file, jsonContent);
      })
    );
  }
};

function normalizeOutputTarget(config: d.Config, outputTarget: any) {
  const path = config.sys.path;

  if (typeof outputTarget.file !== 'string') {
    throw new Error(`docs-json outputTarget missing the "file" option`);
  }

  const results: d.OutputTargetDocsJson = {
    type: 'docs-json',
    file: path.join(config.rootDir, outputTarget.file),
    strict: !!outputTarget.strict
  };

  return results;
}
