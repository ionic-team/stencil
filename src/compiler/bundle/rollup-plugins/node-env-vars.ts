import { Config } from '../../../declarations';
import { buildExpressionReplacer } from '../../build/replacer';
import { Plugin, SourceDescription } from 'rollup';


export default function nodeEnvVars(config: Config) {
  // replace build time expressions, like process.env.NODE_ENV === 'production'

  return {
    name: 'nodeEnvVarsPlugin',

    transform(sourceText: string): Promise<SourceDescription> {
      return Promise.resolve({
        code: buildExpressionReplacer(config, sourceText)
      });
    }
  } as Plugin;
}
