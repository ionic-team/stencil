import { Config } from '../../declarations';


/**
 * DEPRECATED "config" generateWWW, wwwDir, emptyWWW, generateDistribution, distDir, emptyDist
 * since 0.7.0, 2018-03-02
 */
export function _deprecatedToMultipleTarget(config: Config) {
  const deprecatedConfigs: string[] = [];

  if ((config as any).generateWWW !== undefined) {
    deprecatedConfigs.push('generateWWW');

    if ((config as any).generateWWW) {
      config.outputTargets = config.outputTargets || [];
      let o = config.outputTargets.find(o => o.type === 'www');
      if (!o) {
        o = { type: 'www' };
        config.outputTargets.push(o);
      }
    }

    delete (config as any).generateWWW;
  }

  if ((config as any).emptyWWW !== undefined) {
    deprecatedConfigs.push('emptyWWW');

    config.outputTargets = config.outputTargets || [];
    let o = config.outputTargets.find(o => o.type === 'www');
    if (!o) {
      o = { type: 'www' };
      config.outputTargets.push(o);
    }
    o.emptyDir = !!(config as any).emptyWWW;

    delete (config as any).emptyWWW;
  }

  if ((config as any).wwwDir !== undefined) {
    deprecatedConfigs.push('wwwDir');

    config.outputTargets = config.outputTargets || [];
    let o = config.outputTargets.find(o => o.type === 'www');
    if (!o) {
      o = { type: 'www' };
      config.outputTargets.push(o);
    }
    o.dir = (config as any).wwwDir;

    delete (config as any).wwwDir;
  }

  if ((config as any).buildDir !== undefined) {
    deprecatedConfigs.push('buildDir');

    config.outputTargets = config.outputTargets || [];
    let o = config.outputTargets.find(o => o.type === 'www');
    if (!o) {
      o = { type: 'www' };
      config.outputTargets.push(o);
    }
    o.buildDir = (config as any).buildDir;

    delete (config as any).buildDir;
  }

  if ((config as any).wwwIndexHtml !== undefined) {
    deprecatedConfigs.push('wwwIndexHtml');

    config.outputTargets = config.outputTargets || [];
    let o = config.outputTargets.find(o => o.type === 'www');
    if (!o) {
      o = { type: 'www' };
      config.outputTargets.push(o);
    }
    o.indexHtml = (config as any).wwwIndexHtml;

    delete (config as any).wwwIndexHtml;
  }

  if ((config as any).generateDistribution !== undefined) {
    deprecatedConfigs.push('generateDistribution');

    if ((config as any).generateDistribution) {
      config.outputTargets = config.outputTargets || [];
      let o = config.outputTargets.find(o => o.type === 'dist');
      if (!o) {
        o = { type: 'dist' };
        config.outputTargets.push(o);
      }
    }

    delete (config as any).generateDistribution;
  }

  if ((config as any).distDir !== undefined) {
    deprecatedConfigs.push('distDir');

    config.outputTargets = config.outputTargets || [];
    let o = config.outputTargets.find(o => o.type === 'dist');
    if (!o) {
      o = { type: 'dist' };
      config.outputTargets.push(o);
    }
    o.dir = (config as any).distDir;

    delete (config as any).distDir;
  }

  if ((config as any).emptyDist !== undefined) {
    deprecatedConfigs.push('emptyDist');

    config.outputTargets = config.outputTargets || [];
    let o = config.outputTargets.find(o => o.type === 'dist');
    if (!o) {
      o = { type: 'dist' };
      config.outputTargets.push(o);
    }
    o.emptyDir = !!(config as any).emptyDist;

    delete (config as any).emptyDist;
  }

  if ((config as any).collectionDir !== undefined) {
    deprecatedConfigs.push('collectionDir');

    config.outputTargets = config.outputTargets || [];
    let o = config.outputTargets.find(o => o.type === 'dist');
    if (!o) {
      o = { type: 'dist' };
      config.outputTargets.push(o);
    }
    o.dir = (config as any).collectionDir;

    delete (config as any).collectionDir;
  }

  if ((config as any).typesDir !== undefined) {
    deprecatedConfigs.push('typesDir');

    config.outputTargets = config.outputTargets || [];
    let o = config.outputTargets.find(o => o.type === 'dist');
    if (!o) {
      o = { type: 'dist' };
      config.outputTargets.push(o);
    }
    o.dir = (config as any).typesDir;

    delete (config as any).typesDir;
  }

  if ((config as any).publicPath !== undefined) {
    deprecatedConfigs.push('publicPath');

    config.outputTargets = config.outputTargets || [];

    const www = config.outputTargets.find(o => o.type === 'www');
    if (www) {
      www.publicPath = (config as any).publicPath;
    }

    const dist = config.outputTargets.find(o => o.type === 'dist');
    if (dist) {
      dist.publicPath = (config as any).publicPath;
    }

    delete (config as any).publicPath;
  }

  if ((config as any).discoverPublicPath !== undefined) {
    deprecatedConfigs.push('discoverPublicPath');

    config.outputTargets = config.outputTargets || [];

    const www = config.outputTargets.find(o => o.type === 'www');
    if (www) {
      www.discoverPublicPath = (config as any).discoverPublicPath;
    }

    const dist = config.outputTargets.find(o => o.type === 'dist');
    if (dist) {
      dist.discoverPublicPath = (config as any).discoverPublicPath;
    }

    delete (config as any).discoverPublicPath;
  }

  if (deprecatedConfigs.length > 0) {
    const warningMsg = [
      `As of v0.7.0, the config `,
      deprecatedConfigs.length > 1 ? `properties ` : `property `,
      `"${deprecatedConfigs.join(', ')}" `,
      deprecatedConfigs.length > 1 ? `have ` : `has `,
      `been deprecated in favor of a multiple output target configuration. `,
      `Please use the "outputTargets" config which `,
      `is an array of output targets. `,
      `Note that not having an "outputTarget" config will default `,
      `to have an { type: "www" } output target. `,
      `More information aobut the new format can be found here: https://stenciljs.com/docs/config`
    ];
    config.logger.warn(warningMsg.join(''));
  }

  return deprecatedConfigs;
}
