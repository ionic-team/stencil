import { BuildConfig } from '../../../util/interfaces';
import { buildExpressionReplacer } from '../../build/replacer';


export default function nodeEnvVars(config: BuildConfig) {
  // replace build time expressions, like process.env.NODE_ENV === 'production'

  return {
    name: 'nodeEnvVarsPlugin',

    transform(sourceText: string) {
      return buildExpressionReplacer(config, sourceText);
    }
  };
}
