import * as d from '../../declarations';

export async function generateJsonDocs(compilerCtx: d.CompilerCtx, jsonOutputs: d.OutputTargetDocsJson[], docsData: d.JsonDocs) {
  const json = {
    ...docsData,
    components: docsData.components.map(cmp => ({
      tag: cmp.tag,
      encapsulation: cmp.encapsulation,
      readme: cmp.readme,
      docs: cmp.docs,
      usage: cmp.usage,
      props: cmp.props,
      methods: cmp.methods,
      events: cmp.events,
      styles: cmp.styles,
    }))
  };
  const jsonContent = JSON.stringify(json, null, 2);
  await Promise.all(jsonOutputs.map(async jsonOutput => {
    await compilerCtx.fs.writeFile(jsonOutput.file, jsonContent);
  }));
}
