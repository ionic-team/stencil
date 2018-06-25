import * as d from '../../declarations'

export function validateCustomTransformers(config: d.Config) {
  config.customTransformers = config.customTransformers || {
    prependBefore: [],
    appendBefore: [],
    appendAfter: [],
    prependAfter: []
  }

  config.customTransformers.prependBefore = config.customTransformers.prependBefore || []
  config.customTransformers.appendBefore = config.customTransformers.appendBefore || []
  config.customTransformers.appendAfter = config.customTransformers.appendAfter || []
  config.customTransformers.prependAfter = config.customTransformers.prependAfter || []
}