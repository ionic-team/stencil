import * as d from '../../../declarations';
import { isOutputTargetDocsJson } from '../../output-targets/output-utils';

export async function generateJsonDocs(compilerCtx: d.CompilerCtx, docsData: d.JsonDocs, outputTargets: d.OutputTarget[]) {
  const jsonOutputTargets = outputTargets.filter(isOutputTargetDocsJson);
  if (jsonOutputTargets.length === 0) {
    return;
  }

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
    jsonOutputTargets.map(jsonOutput => {
      return compilerCtx.fs.writeFile(jsonOutput.file, jsonContent);
    })
  );
}
