import { Component, ComponentMode, Registry } from './interfaces';


export function getBundleFileName(bundleId: string) {
  return `ionic.${bundleId}.js`;
}


export function getBundleContent(bundleId: string, componentModeLoader: string) {
  return `Ionic.loadComponents('${bundleId}',${componentModeLoader});`;
}


export function getImportComponentWrapper(innerCode: string) {
  return `function importComponent(ionicOpts, exports) {
    var h = ionicOpts.h;
    ${innerCode}
  }`;
}


export function getComponentModeLoader(component: Component, mode: ComponentMode) {
  const t = [
    `'` + component.tag + `'`,
    `'` + mode.name + `'`,
    `'` + mode.styles.replace(/'/g, '"') + `'`,
    `\n` + component.componentImporter
  ];

  return `[` + t.join(',') + `]`;
}


export function getRegistryContent(registry: Registry) {
  let content = '(window.Ionic = window.Ionic || {}).components = ';
  content += JSON.stringify(registry, null, 2) + ';';
  return content;
}


export function getBundleId(bundleIndex: number) {
  return bundleIndex.toString();
}
