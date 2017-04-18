import { Component, ComponentMode, Registry } from './interfaces';


export function getBundleFileName(bundleId: string) {
  return `ionic.${bundleId}.js`;
}


export function getBundleContent(bundleId: string, componentModeLoader: string) {
  return `Ionic.loadComponents(\n/** bundleId **/\n'${bundleId}',${componentModeLoader});`;
}


export function getComponentModeLoader(component: Component, mode: ComponentMode) {
  const tag = component.tag.trim().toLowerCase();

  const modeName = (mode.name ? mode.name.trim().toLowerCase() : '');

  const styles = (mode.styles ? mode.styles.replace(/'/g, '"') : '');

  const componentFn = component.componentImporter.trim();

  const watches = JSON.stringify(component.watches);

  let label = tag;
  if (mode.name) {
    label += '.' + mode.name;
  }

  const t = [
    `/** ${label}: tag [0] **/\n'${tag}'`,
    `/** ${label}: modeName [1] **/\n'${modeName}'`,
    `/** ${label}: styles [2] **/\n'${styles}'`,
    `/** ${label}: importComponent function [3] **/\n${componentFn}`,
    `/** ${label}: watches [4] **/\n${watches}`
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
