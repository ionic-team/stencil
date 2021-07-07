import type * as d from '../../../declarations';
import { getNameText } from '../generate-doc-data';
import { isOutputTargetDocsVscode } from '../../output-targets/output-utils';
import { join } from 'path';

export const generateVscodeDocs = async (
  compilerCtx: d.CompilerCtx,
  docsData: d.JsonDocs,
  outputTargets: d.OutputTarget[],
) => {
  const vsCodeOutputTargets = outputTargets.filter(isOutputTargetDocsVscode);
  if (vsCodeOutputTargets.length === 0) {
    return;
  }

  await Promise.all(
    vsCodeOutputTargets.map(async outputTarget => {
      const json = {
        version: 1.1,
        tags: docsData.components.map(cmp => ({
          name: cmp.tag,
          description: {
            kind: 'markdown',
            value: cmp.docs,
          },
          attributes: cmp.props.filter(p => p.attr).map(serializeAttribute),
          references: getReferences(cmp, outputTarget.sourceCodeBaseUrl),
        })),
      };
      const jsonContent = JSON.stringify(json, null, 2);
      await compilerCtx.fs.writeFile(outputTarget.file, jsonContent);
    }),
  );
};

const getReferences = (cmp: d.JsonDocsComponent, repoBaseUrl: string) => {
  const references = getNameText('reference', cmp.docsTags).map(([name, url]) => ({ name, url }));
  if (repoBaseUrl) {
    references.push({
      name: 'Source code',
      url: join(repoBaseUrl, cmp.filePath),
    });
  }
  if (references.length > 0) {
    return references;
  }
  return undefined;
};

const serializeAttribute = (prop: d.JsonDocsProp) => {
  const attribute: any = {
    name: prop.attr,
    description: prop.docs,
  };
  const values = prop.values
    .filter(({ type, value }) => type === 'string' && value !== undefined)
    .map(({ value }) => ({ name: value }));

  if (values.length > 0) {
    attribute.values = values;
  }
  return attribute;
};
