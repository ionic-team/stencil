import * as d from '../../declarations';
import { plugin as docsPlugin } from '../output-plugins/docs';
import { plugin as angularPlugin } from '../output-plugins/angular';
import { plugin as jsonDocsPlugin } from '../output-plugins/docs-json';
import { plugin as vscodeDocsPlugin } from '../output-plugins/docs-vscode';


export function validatePlugins(config: d.Config) {

  // Add internal plugins as part of the default list of plugins
  config.plugins = (config.plugins || []).concat(
    [docsPlugin, angularPlugin, jsonDocsPlugin, vscodeDocsPlugin]
  ).filter((p: any) => !!p);
}
