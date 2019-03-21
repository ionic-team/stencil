import * as d from '../../declarations';
import { isOutputPlugin } from './output-plugin-utils';
import { generateDocData } from '../docs/generate-doc-data';

type PluginTargetList = [d.Plugin, d.OutputTarget[]];

export async function createPluginOutput(config: d.Config, compilerCtx: d.CompilerCtx, buildCtx: d.BuildCtx, pluginList?: d.Plugin[]) {
  const outputPlugins = pluginList || config.plugins.filter(isOutputPlugin);

  // Build a tuple containing the plugin and all output targets that it will need
  const outputPluginKV = outputPlugins.reduce((all, outputPlugin) => {
    const pluginName = outputPlugin.name;
    const outputTargetList = config.outputTargets.filter(outputTarget => outputTarget.type === pluginName);
    if (outputTargetList.length > 0) {
      all.push([outputPlugin, outputTargetList]);
    }
    return all;
  }, <PluginTargetList[]>[]);

  if (outputPluginKV.length === 0) {
    return;
  }

  // ensure all the styles are built first, which parses all the css docs
  await buildCtx.stylesPromise;

  const docsData = await generateDocData(config, compilerCtx, buildCtx);

  await Promise.all(
    outputPluginKV.map(([outputPlugin, outputTargets]) => {
      return outputPlugin.createOutput(outputTargets, config, compilerCtx, buildCtx, docsData);
    })
  );
}
