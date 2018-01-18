import { Plugin, PluginTransformResults, PluginCtx } from '../../compiler/plugin/plugin-interfaces';


export class StyleMinifyPlugin implements Plugin {

  async transform(sourceText: string, id: string, context: PluginCtx) {
    if (!context.config.minifyCss || !this.usePlugin(id)) {
      return null;
    }

    const results: PluginTransformResults = {};

    const cacheKey = context.cache.createKey(this.name, sourceText);
    const cachedContent = await context.cache.get(cacheKey);

    if (cachedContent != null) {
      results.code = cachedContent;

    } else {
      const minifyResults = context.sys.minifyCss(sourceText);
      minifyResults.diagnostics.forEach(d => {
        context.diagnostics.push(d);
      });

      if (typeof minifyResults.output === 'string') {
        results.code = minifyResults.output;
        await context.cache.put(cacheKey, results.code);
      }
    }

    return results;
  }

  usePlugin(id: string) {
    return /(.css)$/i.test(id);
  }

  get name() {
    return 'StyleMinifyPlugin';
  }

}
