import * as d from '../../declarations/index';


export default function styleMinifyPlugin(): d.Plugin {
  const name = 'styleMinifyPlugin';

  return {

    transform: async function(sourceText: string, id: string, context: d.PluginCtx): Promise<d.PluginTransformResults> {
      if (!context || !context.config.minifyCss || !usePlugin(id)) {
        return null;
      }

      const results: d.PluginTransformResults = {};

      const cacheKey = context.cache.createKey(name, sourceText);
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
    },

    name: name

  };

}


function usePlugin(id: string) {
  return /(.css)$/i.test(id);
}
