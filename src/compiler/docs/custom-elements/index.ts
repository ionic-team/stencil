import * as d from '../../../declarations';
import { isOutputTargetDocsCustomElements } from '../../output-targets/output-utils';

export const generateCustomElementsDocs = async (compilerCtx: d.CompilerCtx, docsData: d.JsonDocs, outputTargets: d.OutputTarget[]) => {
  const customElementsOutputTargets = outputTargets.filter(isOutputTargetDocsCustomElements);

  if (customElementsOutputTargets.length === 0) {
    return;
  }

  const jsonContent = JSON.stringify(customElementsJson(docsData), null, 2);

  await Promise.all(customElementsOutputTargets.map(outputTarget => compilerCtx.fs.writeFile(outputTarget.file, jsonContent)));
};

function customElementsJson(docsData: d.JsonDocs) {
  // https://github.com/webcomponents/custom-elements-json/pull/8
  return {
    version: 1.2,
    tags: docsData.components.map(component => ({
      name: component.tag,
      path: component.filePath,
      description: component.docs,

      attributes: component.props
        .filter(prop => prop.attr)
        .map(prop => ({
          name: prop.attr,
          type: prop.type,
          description: prop.docs,
          defaultValue: prop.default,
          required: prop.required,
        })),

      properties: component.props.map(prop => ({
        name: prop.name,
        type: prop.type,
        description: prop.docs,
        defaultValue: prop.default,
        required: prop.required,
      })),

      events: component.events.map(event => ({
        name: event.event,
        description: event.docs,
      })),

      methods: component.methods.map(method => ({
        name: method.name,
        description: method.docs,
        signature: method.signature,
      })),

      slots: component.slots.map(slot => ({
        name: slot.name,
        description: slot.docs,
      })),

      cssCustomProperties: component.styles
        .filter(style => style.annotation === 'prop')
        .map(style => ({
          name: style.name,
          description: style.docs,
        })),

      cssShadowParts: component.parts.map(part => ({
        name: part.name,
        description: part.docs,
      })),
    })),
  };
}
