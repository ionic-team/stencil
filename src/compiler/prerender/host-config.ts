import * as d from '../../declarations';
import { join, relative } from 'path';

export const generateHostConfig = async (
  config: d.Config,
  compilerCtx: d.CompilerCtx,
  outputTarget: d.OutputTargetWww,
  entryModules: d.EntryModule[],
  hydrateResults: d.HydrateResults[],
) => {
  const hostConfig: d.HostConfig = {
    hosting: {
      rules: [],
    },
  };

  hydrateResults = hydrateResults.sort((a, b) => {
    if (a.url.toLowerCase() < b.url.toLowerCase()) return -1;
    if (a.url.toLowerCase() > b.url.toLowerCase()) return 1;
    return 0;
  });

  for (const hydrateResult of hydrateResults) {
    const hostRule = generateHostRule(outputTarget, entryModules, hydrateResult);
    if (hostRule) {
      hostConfig.hosting.rules.push(hostRule);
    }
  }

  addDefaults(outputTarget, hostConfig);

  const hostConfigFilePath = join(outputTarget.appDir, HOST_CONFIG_FILENAME);

  await mergeUserHostConfigFile(config, compilerCtx, hostConfig);

  await compilerCtx.fs.writeFile(hostConfigFilePath, JSON.stringify(hostConfig, null, 2));
};

export const generateHostRule = (outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[], hydrateResults: d.HydrateResults) => {
  const hostRule: d.HostRule = {
    include: hydrateResults.pathname,
    headers: generateHostRuleHeaders(outputTarget, entryModules, hydrateResults),
  };

  if (hostRule.headers.length === 0) {
    return null;
  }

  return hostRule;
};

export const generateHostRuleHeaders = (outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[], hydrateResults: d.HydrateResults) => {
  const hostRuleHeaders: d.HostRuleHeader[] = [];

  addStyles(hostRuleHeaders, hydrateResults);
  addCoreJs(outputTarget, 'compilerCtx.appCoreWWWPath', hostRuleHeaders);
  addBundles(outputTarget, entryModules, hostRuleHeaders, hydrateResults.components);
  addScripts(hostRuleHeaders, hydrateResults);
  addImgs(hostRuleHeaders, hydrateResults);

  return hostRuleHeaders;
};

const addCoreJs = (outputTarget: d.OutputTargetWww, appCoreWWWPath: string, hostRuleHeaders: d.HostRuleHeader[]) => {
  const url = getUrlFromFilePath(outputTarget, appCoreWWWPath);

  hostRuleHeaders.push(formatLinkRelPreloadHeader(url));
};

export const addBundles = (outputTarget: d.OutputTargetWww, entryModules: d.EntryModule[], hostRuleHeaders: d.HostRuleHeader[], components: d.HydrateComponent[]) => {
  components = sortComponents(components);

  const bundleIds = getBundleIds(entryModules, components);
  for (const bundleId of bundleIds) {
    if (hostRuleHeaders.length < MAX_LINK_REL_PRELOAD_COUNT) {
      const bundleUrl = getBundleUrl(outputTarget, bundleId);

      hostRuleHeaders.push(formatLinkRelPreloadHeader(bundleUrl));
    }
  }
};

export const getBundleIds = (_entryModules: d.EntryModule[], _components: d.HydrateComponent[]) => {
  const bundleIds: string[] = [];

  // components.forEach(cmp => {
  //   entryModules.forEach(mb => {
  //     const moduleFile = mb.moduleFiles.find(mf => mf.cmpCompilerMeta && mf.cmpCompilerMeta.tagName === cmp.tag);
  //     if (!moduleFile) {
  //       return;
  //     }

  //     let bundleId: string;
  //     if (typeof moduleFile.cmpCompilerMeta.bundleIds === 'string') {
  //       bundleId = moduleFile.cmpCompilerMeta.bundleIds;
  //     } else {

  //       bundleId = (moduleFile.cmpCompilerMeta.bundleIds as d.BundleIds)[DEFAULT_MODE];
  //       if (!bundleId) {
  //         bundleId = (moduleFile.cmpCompilerMeta.bundleIds as d.BundleIds)[DEFAULT_STYLE_MODE];
  //       }
  //     }

  //     if (bundleId && bundleIds.indexOf(bundleId) === -1) {
  //       bundleIds.push(bundleId);
  //     }
  //   });
  // });

  return bundleIds;
};

const getBundleUrl = (outputTarget: d.OutputTargetWww, _bundleId: string) => {
  // const unscopedFileName = 'getBrowserFilename(bundleId, false)';
  const unscopedWwwBuildPath = 'sys.path.join(getAppBuildDir(config, outputTarget), unscopedFileName)';
  return getUrlFromFilePath(outputTarget, unscopedWwwBuildPath);
};

export const getUrlFromFilePath = (outputTarget: d.OutputTargetWww, filePath: string) => {
  let url = join('/', relative(outputTarget.appDir, filePath));

  url = outputTarget.baseUrl + url.substring(1);

  return url;
};

export const sortComponents = (components: d.HydrateComponent[]) => {
  return components.sort((a, b) => {
    if (a.depth > b.depth) return -1;
    if (a.depth < b.depth) return 1;
    if (a.count > b.count) return -1;
    if (a.count < b.count) return 1;
    if (a.tag < b.tag) return -1;
    if (a.tag > b.tag) return 1;
    return 0;
  });
};

const addStyles = (hostRuleHeaders: d.HostRuleHeader[], hydrateResults: d.HydrateResults) => {
  for (const style of hydrateResults.styles) {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = new URL(style.href);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
    }
  }
};

const addScripts = (hostRuleHeaders: d.HostRuleHeader[], hydrateResults: d.HydrateResults) => {
  for (const script of hydrateResults.scripts) {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = new URL(script.src);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
    }
  }
};

const addImgs = (hostRuleHeaders: d.HostRuleHeader[], hydrateResults: d.HydrateResults) => {
  for (const img of hydrateResults.imgs) {
    if (hostRuleHeaders.length >= MAX_LINK_REL_PRELOAD_COUNT) {
      return;
    }

    const url = new URL(img.src);
    if (url.hostname === hydrateResults.hostname) {
      hostRuleHeaders.push(formatLinkRelPreloadHeader(url.pathname));
    }
  }
};

export const formatLinkRelPreloadHeader = (url: string) => {
  const header: d.HostRuleHeader = {
    name: 'Link',
    value: formatLinkRelPreloadValue(url),
  };
  return header;
};

const formatLinkRelPreloadValue = (url: string) => {
  const parts = [`<${url}>`, `rel=preload`];

  const ext = url.split('.').pop().toLowerCase();
  if (ext === SCRIPT_EXT) {
    parts.push(`as=script`);
  } else if (ext === STYLE_EXT) {
    parts.push(`as=style`);
  } else if (IMG_EXTS.indexOf(ext) > -1) {
    parts.push(`as=image`);
  }

  return parts.join(';');
};

const addDefaults = (outputTarget: d.OutputTargetWww, hostConfig: d.HostConfig) => {
  addBuildDirCacheControl(outputTarget, hostConfig);
  addServiceWorkerNoCacheControl(outputTarget, hostConfig);
};

const addBuildDirCacheControl = (outputTarget: d.OutputTargetWww, hostConfig: d.HostConfig) => {
  const url = getUrlFromFilePath(outputTarget, 'getAppBuildDir(config, outputTarget)');

  hostConfig.hosting.rules.push({
    include: join(url, '**'),
    headers: [
      {
        name: `Cache-Control`,
        value: `public, max-age=31536000`,
      },
    ],
  });
};

const addServiceWorkerNoCacheControl = (outputTarget: d.OutputTargetWww, hostConfig: d.HostConfig) => {
  if (!outputTarget.serviceWorker) {
    return;
  }

  const url = getUrlFromFilePath(outputTarget, outputTarget.serviceWorker.swDest);

  hostConfig.hosting.rules.push({
    include: url,
    headers: [
      {
        name: `Cache-Control`,
        value: `no-cache, no-store, must-revalidate`,
      },
    ],
  });
};

const mergeUserHostConfigFile = async (config: d.Config, compilerCtx: d.CompilerCtx, hostConfig: d.HostConfig) => {
  const hostConfigFilePath = join(config.srcDir, HOST_CONFIG_FILENAME);
  try {
    const userHostConfigStr = await compilerCtx.fs.readFile(hostConfigFilePath);

    const userHostConfig = JSON.parse(userHostConfigStr) as d.HostConfig;

    mergeUserHostConfig(userHostConfig, hostConfig);
  } catch (e) {}
};

export const mergeUserHostConfig = (userHostConfig: d.HostConfig, hostConfig: d.HostConfig) => {
  if (!userHostConfig || !userHostConfig.hosting) {
    return;
  }

  if (!Array.isArray(userHostConfig.hosting.rules)) {
    return;
  }

  const rules = userHostConfig.hosting.rules.concat(hostConfig.hosting.rules);

  hostConfig.hosting.rules = rules;
};

export const DEFAULT_MODE = 'md';
const MAX_LINK_REL_PRELOAD_COUNT = 6;
export const HOST_CONFIG_FILENAME = 'host.config.json';

const IMG_EXTS = ['png', 'gif', 'svg', 'jpg', 'jpeg', 'webp'];
const STYLE_EXT = 'css';
const SCRIPT_EXT = 'js';
