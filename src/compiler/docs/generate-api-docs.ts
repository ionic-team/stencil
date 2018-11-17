import * as d from '../../declarations';

export async function generateApiDocs(compilerCtx: d.CompilerCtx, apiOutputs: d.OutputTargetDocsApi[], docsData: d.JsonDocs) {
  const content: string[] = [];
  docsData.components.forEach(cmp => generateComponent(cmp, content));

  const contentStr = content.join('\n');
  await Promise.all(apiOutputs.map(async apiOutput => {
    await compilerCtx.fs.writeFile(apiOutput.file, contentStr);
  }));
}

function generateComponent(component: d.JsonDocsComponent, content: string[]) {
  content.push('');

  component.props.forEach(prop => {
    content.push(`${component.tag},prop,${prop.name},${prop.type},${prop.default},${prop.required}`);
  });
  component.methods.forEach(prop => {
    content.push(`${component.tag},method,${prop.name},${prop.signature}`);
  });
  component.events.forEach(prop => {
    content.push(`${component.tag},event,${prop.event},${prop.detail},${prop.bubbles}`);
  });
  component.styles.forEach(prop => {
    content.push(`${component.tag},style,${prop.name}`);
  });
}
