import * as d from '../../declarations';

export async function generateJsonDocs(compilerCtx: d.CompilerCtx, jsonOutputs: d.OutputTargetDocsJson[], docsData: d.JsonDocs) {
  const jsonContent = JSON.stringify(docsData, null, 2);
  await Promise.all(jsonOutputs.map(async jsonOutput => {
    await compilerCtx.fs.writeFile(jsonOutput.file, jsonContent);
  }));
}
