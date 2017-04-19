import { Component, ComponentMode, Registry } from './interfaces';


export function getBundleFileName(bundleId: string) {
  return `ionic.${bundleId}.js`;
}


export function getBundleContent(bundleId: string, componentModeLoader: string) {
  return `Ionic.loadComponents(\n/** bundleId **/\n'${bundleId}',${componentModeLoader});`;
}


export function getComponentModeLoader(component: Component, mode: ComponentMode) {
  const tag = component.tag.trim().toLowerCase();

  const componentClass = component.componentClass;

  const watches = JSON.stringify(component.watches);

  const modeName = (mode.name ? mode.name.trim().toLowerCase() : '');

  const styles = (mode.styles ? ('\'' + mode.styles.replace(/'/g, '"') + '\'') : 'null');

  const shadow = component.shadow;

  const componentFn = component.componentImporter.trim();

  let label = tag;
  if (mode.name) {
    label += '.' + mode.name;
  }

  const t = [
    `/** ${label}: [0] tagName **/\n'${tag}'`,
    `/** ${label}: [1] component class name **/\n'${componentClass}'`,
    `/** ${label}: [2] watches **/\n${watches}`,
    `/** ${label}: [3] modeName **/\n'${modeName}'`,
    `/** ${label}: [4] styles **/\n${styles}`,
    `/** ${label}: [5] shadow **/\n${shadow}`,
    `/** ${label}: [6] importComponent function **/\n${componentFn}`
  ];

  return `\n\n/***************** ${label} *****************/\n[\n` + t.join(',\n\n') + `\n\n]`;
}


export function getRegistryContent(registry: Registry) {
  let content = '(window.Ionic = window.Ionic || {}).components = ';
  content += JSON.stringify(registry, null, 2) + ';';
  return content;
}


export function getBundleId(bundleIndex: number) {
  return bundleIndex.toString();
}
